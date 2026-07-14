import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SetsDto } from './dto/sets.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { format } from 'date-fns';
import PDFDocument from 'pdfkit';
import type { Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SetsService {
  private ai: GoogleGenAI;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.ai = new GoogleGenAI({ apiKey: this.config.get('GEMINI_API_KEY') });
  }

  async getAllSets(userId: number) {
    var sets = await this.prisma.set.findMany({
      where: { userId },
      include: {
        _count: {
          select: { cards: true },
        },
      },
    });
    return sets.map((set) => ({
      id: set.id,
      title: set.title,
      description: set.description,
      cardCount: set._count.cards,
    }));
  }

  async getDueSets(userId: number) {
    const now = new Date();

    const sets = await this.prisma.set.findMany({
      where: {
        userId,
        cards: {
          some: {
            OR: [
              { userData: { none: { userId } } }, // Set has new cards
              { userData: { some: { userId, due: { lte: now } } } }, // Set has overdue cards
            ],
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        _count: {
          select: { cards: true }, // Total cards in the set
        },
        cards: {
          where: {
            OR: [
              { userData: { none: { userId } } },
              { userData: { some: { userId, due: { lte: now } } } },
            ],
          },
          select: { id: true },
        },
      },
    });

    return sets.map((set) => ({
      id: set.id,
      title: set.title,
      description: set.description,
      totalCards: set._count.cards,
      dueCardsCount: set.cards.length,
    }));
  }

  async getSetById(userId: number, setId: number) {
    const set = await this.prisma.set.findUnique({
      where: {
        id: setId,
        userId: userId,
      },
      include: {
        cards: true,
      },
    });
    if (!set) {
      throw new NotFoundException('Set not found');
    }
    return set;
  }

  async getPracticeSetById(userId: number, setId: number) {
    const now = new Date();

    const set = await this.prisma.set.findFirst({
      where: {
        id: setId,
        userId: userId,
      },
      include: {
        cards: {
          where: {
            OR: [
              { userData: { none: { userId } } }, // Set has new cards
              { userData: { some: { userId, due: { lte: now } } } }, // Set has overdue cards
            ],
          },
          select: {
            id: true,
            question: true,
            // we do not include the answer
          },
        },
      },
    });

    if (!set) {
      throw new NotFoundException('Practice set not found');
    }

    return set;
  }

  async generateSetFromFile(
    userId: number,
    files: Express.Multer.File[],
    difficulty: string[],
    count: number,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedFileNames = files.map((f) => f.originalname);

    const prompt = `Analyze the attached documents and create a set of flashcards out of them. 
  
  REQUESTS:
  1. Generate EXACTLY ${count} flashcards. 
  2. The difficulty level of the questions must balance across: ${difficulty.join(', ')}.
  3. Ensure the questions are concise, test active recall and need 2-5 words to answer.`;

    const contentsPayload: any[] = [];

    for (const file of files) {
      if (file.mimetype === 'application/pdf') {
        contentsPayload.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: file.buffer.toString('base64'),
          },
        });
      } else {
        const fileContent = file.buffer.toString('utf-8');
        contentsPayload.push({
          text: `Material Document Name (${file.originalname}):\n${fileContent}`,
        });
      }
    }

    contentsPayload.push({ text: prompt });

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contentsPayload,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'A descriptive title for the flashcard set',
              },
              description: {
                type: Type.STRING,
                description: 'A short summary of what these cards cover',
              },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                  },
                  required: ['question', 'answer'],
                },
              },
            },
            required: ['title', 'description', 'cards'],
          },
        },
      });

      if (!response.text) {
        throw new BadRequestException(
          'Gemini failed to generate text contents.',
        );
      }

      const generatedData = JSON.parse(response.text);

      return {
        ...generatedData,
        sourceFiles: uploadedFileNames,
      };
    } catch (error) {
      console.error('Gemini processing failed:', error);
      throw new BadRequestException('Failed to process file contents with AI.');
    }
  }

  async createSet(userId: number, setsDto: SetsDto) {
    const newSet = await this.prisma.set.create({
      data: {
        title: setsDto.title,
        description: setsDto.description,
        userId: userId,
        cards: {
          create: setsDto.cards,
        },
      },
      include: {
        cards: true,
      },
    });
    return {
      message: 'Set created successfully',
      data: {
        id: newSet.id,
        title: newSet.title,
        description: newSet.description,
        cardCount: newSet.cards.length,
        createdAt: format(newSet.createdAt, 'yyyy-MM-dd'),
      },
    };
  }

  async updateSet(userId: number, setId: number, setsDto: Partial<SetsDto>) {
    const existingSet = await this.prisma.set.findUnique({
      where: { id: setId, userId: userId },
    });

    if (!existingSet) {
      throw new NotFoundException('Set not found');
    }

    // use a transaction to ensure atomicity of the update operation

    return await this.prisma.$transaction(async (transaction) => {
      if (setsDto.cards) {
        const incomingIds = setsDto.cards
          .map((c) => c.id)
          .filter((id): id is number => !!id); // !!id to filter out undefined

        await transaction.card.deleteMany({
          where: {
            setId,
            id: { notIn: incomingIds },
          },
        });
      }

      const updatedSet = await transaction.set.update({
        where: { id: setId },
        data: {
          title: setsDto.title,
          description: setsDto.description,
          cards: setsDto.cards
            ? {
                upsert: setsDto.cards.map((card) => ({
                  where: { id: card.id || 0 },
                  create: { question: card.question, answer: card.answer },
                  update: { question: card.question, answer: card.answer },
                })),
              }
            : undefined,
        },
        include: { cards: true },
      });

      // exclude createdAt from the response in order to format it
      const { createdAt, ...rest } = updatedSet;

      return {
        message: 'Set updated successfully',
        data: {
          ...rest,
          cardCount: updatedSet.cards.length,
          createdAt: format(createdAt, 'yyyy-MM-dd'),
        },
      };
    });
  }

  async deleteSet(userId: number, setId: number) {
    const result = await this.prisma.set.deleteMany({
      where: {
        id: setId,
        userId: userId, // must own the set
      },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        'Set not found or you do not have permission to delete it',
      );
    }

    return {
      message: 'Set and all associated cards deleted successfully',
    };
  }

  convertToCSV(setData: SetsDto) {
    const header = 'Question,Answer';

    const rows = setData.cards.map((c) => {
      // wrap in quotes and escape existing quotes by doubling them
      const cleanQ = `"${c.question.replace(/"/g, '""')}"`;
      const cleanA = `"${c.answer.replace(/"/g, '""')}"`;
      return `${cleanQ},${cleanA}`;
    });

    return [header, ...rows].join('\n');
  }

  generatePDF(setData: SetsDto, res: Response) {
    const doc = new PDFDocument();
    doc.pipe(res); // stream the PDF directly to the response

    doc.fontSize(25).text(setData.title, { align: 'center' });
    doc.fontSize(12).text(setData.description, { align: 'center' });
    doc.moveDown();

    setData.cards.forEach((card, index) => {
      doc.fontSize(12).text(`${index + 1}. Q: ${card.question}`);
      doc.fontSize(12).text(`    A: ${card.answer}`);
      doc.moveDown();
    });

    doc.end();
  }

  async sendSet(senderId: number, setId: number, recipientId: number) {
    const originalSet = await this.prisma.set.findUnique({
      where: { id: setId, userId: senderId },
      include: { cards: true },
    });
    if (!originalSet) {
      throw new NotFoundException(
        'Set not found or you do not have permission to share it',
      );
    }
    const clonedSet = await this.prisma.set.create({
      data: {
        title: originalSet.title,
        description: originalSet.description,
        userId: recipientId,
        cards: {
          create: originalSet.cards.map((card) => ({
            question: card.question,
            answer: card.answer,
          })),
        },
      },
    });
    return {
      message: 'Set shared successfully',
    };
  }
}
