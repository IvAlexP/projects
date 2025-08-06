<?php
/**
 * This class provides methods to generate CSV, PDF, and RSS feeds for entity rankings and statistics.
 */
class ExportService
{
    private Entity $entityModel;
    private Review $reviewModel;
    private User $userModel;

    public function __construct()
    {
        $this->entityModel = new Entity();
        $this->reviewModel = new Review();
        $this->userModel = new User();
    }

    public function getStatsExportData(): array
    {
        try {
            $entities = $this->entityModel->getExportStats();
            return $entities;
        } catch (Exception $e) {
            error_log("Error getting stats export data: " . $e->getMessage());
            return [];
        }
    }

    public function getRankingsExportData(): array
    {
        try {
            $rankings = $this->entityModel->getEntityRankings('DESC', null);
            return $rankings;
        } catch (Exception $e) {
            error_log("Error getting rankings export data: " . $e->getMessage());
            return [];
        }
    }

    public function generateCSV(array $data, string $filename): void
    {
        if (empty($data)) {
            header('Content-Type: text/plain');
            echo "No data available for export";
            return;
        }

        foreach ($data as &$row) {
            if (isset($row['description'])) {
                unset($row['description']);
            }
        }
        unset($row);

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '.csv"');
        header('Cache-Control: no-cache, must-revalidate');
        header('Pragma: no-cache');

        $output = fopen('php://output', 'w');

        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        fputcsv($output, array_keys($data[0]));

        foreach ($data as $row) {
            fputcsv($output, $row);
        }

        fclose($output);
    }
    
    public function generatePDF(array $data, string $title, string $filename): void
    {
        try {
            if (ob_get_level()) {
                ob_end_clean();
            }

            if (headers_sent()) {
                throw new Exception('Headers already sent. Cannot generate PDF.');
            }

            $tcpdfPath = dirname(dirname(dirname(__FILE__))) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'tecnickcom' . DIRECTORY_SEPARATOR . 'tcpdf' . DIRECTORY_SEPARATOR . 'tcpdf.php';
            require_once($tcpdfPath);

            $pdf = new TCPDF('L', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

            $pdf->SetCreator('IRI LilKartoffel');
            $pdf->SetAuthor('IRI LilKartoffel');
            $pdf->SetTitle($title);

            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            $pdf->SetMargins(15, 15, 15);
            $pdf->SetAutoPageBreak(TRUE, 15);

            $pdf->AddPage();
            $pdf->SetFont('helvetica', 'B', 16);
            $pdf->Cell(0, 10, $title, 0, 1, 'C');
            $pdf->Ln(5);
            if (!empty($data)) {
                $pdf->SetFont('helvetica', 'B', 10);

                $headers = array_keys($data[0]);

                if (($key = array_search('description', $headers)) !== false) {
                    unset($headers[$key]);
                    $headers = array_values($headers); 
                }

                $columnWidths = [];
                $totalWidth = 270;
                foreach ($headers as $header) {
                    switch ($header) {
                        case 'id':
                            $columnWidths[] = 20;
                            break;
                        case 'entity_name':
                            $columnWidths[] = 60;
                            break;
                        case 'city':
                            $columnWidths[] = 35;
                            break;
                        case 'category_name':
                            $columnWidths[] = 35;
                            break;
                        case 'total_reviews':
                        case 'review_count':
                            $columnWidths[] = 25;
                            break;
                        case 'average_rating':
                            $columnWidths[] = 25;
                            break;
                        case 'last_review_date':
                            $columnWidths[] = 40;
                            break;
                        case 'name':
                            $columnWidths[] = 60;
                            break;
                        default:
                            $columnWidths[] = 30;
                            break;
                    }
                }

                $currentTotal = array_sum($columnWidths);
                if ($currentTotal > $totalWidth) {
                    $ratio = $totalWidth / $currentTotal;
                    $columnWidths = array_map(function ($width) use ($ratio) {
                        return $width * $ratio;
                    }, $columnWidths);
                }

                foreach ($headers as $index => $header) {
                    $pdf->Cell($columnWidths[$index], 8, ucfirst(str_replace('_', ' ', $header)), 1, 0, 'C');
                }
                $pdf->Ln();

                $pdf->SetFont('helvetica', '', 9);
                foreach ($data as $row) {
                    foreach ($headers as $index => $header) {
                        $cellValue = isset($row[$header]) ? $row[$header] : null;

                        if ($cellValue === null || $cellValue === '') {
                            $displayValue = 'N/A';
                        } elseif (is_numeric($cellValue) && strpos((string)$cellValue, '.') !== false) {
                            $displayValue = number_format((float)$cellValue, 2);
                        } else {
                            $displayValue = (string)$cellValue;
                        }
                        if (strlen($displayValue) > 30) {
                            $displayValue = substr($displayValue, 0, 27) . '...';
                        }

                        $pdf->Cell($columnWidths[$index], 6, $displayValue, 1, 0, 'C');
                    }
                    $pdf->Ln();
                }
            } else {
                $pdf->SetFont('helvetica', '', 12);
                $pdf->Cell(0, 10, 'No data available', 0, 1, 'C');
            }

            $pdf->Output($filename . '.pdf', 'D');
        } catch (Exception $e) {
            error_log("Error generating PDF: " . $e->getMessage());
            header('Content-Type: text/plain');
            echo "Error generating PDF: " . $e->getMessage();
        }
    }

    public function generateRSS(array $rankings): string
    {
        try {
            $baseUrl = 'http://' . $_SERVER['HTTP_HOST'];
            $currentDate = date('r');

            $rss = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
            $rss .= '<rss version="2.0">' . "\n";
            $rss .= '  <channel>' . "\n";
            $rss .= '    <title>IRI LilKartoffel - Entity Rankings</title>' . "\n";
            $rss .= '    <link>' . $baseUrl . '</link>' . "\n";
            $rss .= '    <description>Latest entity rankings from IRI LilKartoffel</description>' . "\n";
            $rss .= '    <language>en-us</language>' . "\n";
            $rss .= '    <pubDate>' . $currentDate . '</pubDate>' . "\n";
            $rss .= '    <lastBuildDate>' . $currentDate . '</lastBuildDate>' . "\n";

            foreach ($rankings as $entity) {
                $entityName = htmlspecialchars($entity['name'], ENT_XML1);
                $entityDesc = isset($entity['description']) ? htmlspecialchars($entity['description'], ENT_XML1) : '';
                $avgRating = number_format($entity['average_rating'], 2);
                $reviewCount = $entity['review_count'];
                $category = htmlspecialchars($entity['category_name'], ENT_XML1);
                $link = $baseUrl . '/entity/' . $entity['id'];

                $rss .= '    <item>' . "\n";
                $rss .= '      <title>' . $entityName . '</title>' . "\n";
                $rss .= '      <description>' . $entityDesc . '</description>' . "\n";
                $rss .= '      <avgRating>' . $avgRating . '</avgRating>' . "\n";
                $rss .= '      <reviewCount>' . $reviewCount . '</reviewCount>' . "\n";
                $rss .= '      <category>' . $category . '</category>' . "\n";
                $rss .= '      <link>' . $link . '</link>' . "\n";
                $rss .= '    </item>' . "\n";
            }

            $rss .= '  </channel>' . "\n";
            $rss .= '</rss>' . "\n";

            return $rss;
        } catch (Exception $e) {
            error_log("Error generating RSS: " . $e->getMessage());
            return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title><description>Error generating RSS feed</description></channel></rss>';
        }
    }
}
