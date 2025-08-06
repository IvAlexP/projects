<?php
/**
 * Handles statistics and rankings functionalities including overview stats, entity rankings, city rankings and export functionalities.
 * Also generates RSS feeds for entity rankings.
 */
class StatisticsController extends BaseController
{
    private Entity $entityModel;
    private Review $reviewModel;
    private ExportService $exportService;

    public function __construct()
    {
        parent::__construct();
        $this->entityModel = new Entity();
        $this->reviewModel = new Review();
        $this->exportService = new ExportService();
    }

    public function getOverviewStats(): void
    {
        try {
            $totalEntities = $this->entityModel->getApprovedEntitiesCount();
            $totalReviews = $this->reviewModel->getTotalReviewsCount();
            $totalUsers = $this->userModel->getTotalUsersCount();
            $totalCities = $this->entityModel->getUniqueCitiesCount();

            Response::success([
                'stats' => [
                    'total_entities' => $totalEntities,
                    'total_reviews' => $totalReviews,
                    'total_users' => $totalUsers,
                    'total_cities' => $totalCities
                ]
            ]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getMostLovedRankings(): void
    {
        try {
            $rankings = $this->entityModel->getEntityRankings('DESC');
            Response::success(['rankings' => $rankings]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getMostHatedRankings(): void
    {
        try {
            $rankings = $this->entityModel->getEntityRankings('ASC');
            Response::success(['rankings' => $rankings]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getCityRankings($city): void
    {
        try {
            $rankings = $this->entityModel->getEntityRankings('DESC', $city);
            Response::success(['rankings' => $rankings]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getCities(): void
    {
        try {
            $cities = $this->entityModel->getCitiesWithEntitiesCount();
            Response::success(['cities' => $cities]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function exportStats($format): void
    {
        try {
            $data = $this->exportService->getStatsExportData();
            if ($format === 'csv') {
                $this->exportService->generateCSV($data, 'statistics-report-' . date('Y-m-d'));
            } elseif ($format === 'pdf') {
                $this->exportService->generatePDF($data, 'Statistics Report', 'statistics-report-' . date('Y-m-d'));
            } else {
                Response::error('Unsupported export format', 400);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function exportRankings($format): void
    {
        try {
            $data = $this->exportService->getRankingsExportData();
            if ($format === 'csv') {
                $this->exportService->generateCSV($data, 'entity-rankings-' . date('Y-m-d'));
            } elseif ($format === 'pdf') {
                $this->exportService->generatePDF($data, 'Entity Rankings', 'entity-rankings-' . date('Y-m-d'));
            } else {
                Response::error('Unsupported export format', 400);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function generateRSSFeed(): void
    {
        try {
            $rankings = $this->entityModel->getEntityRankings('DESC', null);

            header('Content-Type: text/xml; charset=UTF-8');
            header('Cache-Control: no-cache, must-revalidate');
            header('Pragma: no-cache');

            echo $this->exportService->generateRSS($rankings);
        } catch (Exception $e) {
            header('Content-Type: text/plain; charset=UTF-8');
            echo "RSS Feed Error: " . $e->getMessage();
        }
    }
}
