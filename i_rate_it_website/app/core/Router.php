<?php
class Router
{
    private function getRequestData(): array
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    public function dispatch($requestURL, $requestMethod)
    {
        $path = parse_url($requestURL, PHP_URL_PATH);
        $parts = explode('/', trim($path, '/'));
        if ($parts[1] == "api") {
            switch ($parts[2]) {                
                case "email-register":
                    $controller = new ValidationsController();
                    $data = $this->getRequestData();
                    $email = $data['email'] ?? '';
                    $controller->validateEmailRegistration($email);
                    break;
                case "email-login":
                    $controller = new ValidationsController();
                    $data = $this->getRequestData();
                    $email = $data['email'] ?? '';
                    $controller->validateEmailLogin($email);
                    break;
                case "password-validate":
                    $controller = new ValidationsController();
                    $data = $this->getRequestData();
                    $password = $data['password'] ?? '';
                    $controller->validatePasswordRegistration($password);
                    break;
                case "city-validate":
                    $controller = new ValidationsController();
                    $data = $this->getRequestData();
                    $city = $data['city'] ?? '';
                    $controller->validateCityRegistration($city);
                    break;
                case "first-name-validate":
                    $controller = new ValidationsController();
                    $data = $this->getRequestData();
                    $firstName = $data['first_name'] ?? '';
                    $controller->validateNameRegistration($firstName);
                    break;
                case "last-name-validate":
                    $controller = new ValidationsController();
                    $data = $this->getRequestData();
                    $lastName = $data['last_name'] ?? '';
                    $controller->validateNameRegistration($lastName);
                    break;
                case 'categories':
                    $categoryController = new CategoryController();
                    if ($requestMethod == 'get') {
                        return $categoryController->getAllCategories();
                    } elseif ($requestMethod == 'post') {
                        return $categoryController->createCategory();
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'traits':
                    $categoryController = new CategoryController();
                    if ($requestMethod == 'get') {
                        if (isset($parts[3])) {
                            return $categoryController->getTraitsByCategory($parts[3]);
                        } else {
                            Response::error('Category ID is required', 400);
                        }
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'entities':
                    $entityController = new EntityController();
                    if ($requestMethod == 'get') {
                        if (isset($parts[3])) {
                            return $entityController->getEntitiesByCategory($parts[3]);
                        } else {
                            Response::error('Category ID is required', 400);
                        }
                    } elseif ($requestMethod == 'post' && !isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
                        // POST without override = create new entity
                        return $entityController->createEntity();
                    } elseif ($requestMethod == 'put' || ($requestMethod == 'post' && isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']) && $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] == 'PUT')) {
                        if (isset($parts[3])) {
                            return $entityController->updateEntity($parts[3]);
                        } else {
                            header("HTTP/1.0 400 Bad Request");
                            echo json_encode(['error' => 'Bad Request']);
                        }
                    } elseif ($requestMethod == 'delete' || ($requestMethod == 'post' && isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']) && $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] == 'DELETE')) {
                        if (isset($parts[3])) {
                            return $entityController->deleteEntity($parts[3]);
                        } else {
                            header("HTTP/1.0 400 Bad Request");
                            echo json_encode(['error' => 'Bad Request']);
                        }
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'nearby-entities':
                    $entityController = new EntityController();
                    if ($requestMethod == 'get') {
                        return $entityController->getNearbyEntities();
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'entity':
                    $entityController = new EntityController();
                    if ($requestMethod == 'get') {
                        if (isset($parts[3])) {
                            return $entityController->getEntityById($parts[3]);
                        } else {
                            Response::error('Entity ID is required', 400);
                        }
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'login':
                    $userController = new UserController();
                    if ($requestMethod == 'post') {
                        $userController->login();
                        return;
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'register':
                    $userController = new UserController();
                    if ($requestMethod == 'post') {
                        $userController->register();
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case "auth-status":
                    $controller = new UserController();
                    $controller->getAuthStatus();
                    break;
                case 'reviews':
                    $reviewController = new ReviewController();
                    if ($requestMethod == 'get') {
                        if (isset($parts[3]) && $parts[3] === 'reports') {
                            return $reviewController->getReviewReports();
                        } elseif (isset($parts[3])) {
                            return $reviewController->getReviewsByEntityId($parts[3]);
                        } else {
                            Response::error('Entity ID is required', 400);
                        }
                    } elseif ($requestMethod == 'post') {
                        if (isset($parts[3]) && $parts[3] === 'report') {
                            return $reviewController->addReviewReport();
                        } elseif (isset($parts[3]) && $parts[3] === 'report-approve') {
                            return $reviewController->approveReviewReport();
                        } elseif (isset($parts[3]) && $parts[3] === 'report-cancel') {
                            return $reviewController->cancelReviewReport();
                        } else {
                            return $reviewController->createReview();
                        }
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;                case 'review-vote':
                    $reviewController = new ReviewController();
                    if ($requestMethod == 'post') {
                        return $reviewController->voteReview();
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'review-remove-vote':
                    $reviewController = new ReviewController();
                    if ($requestMethod == 'delete') {
                        return $reviewController->removeVote();
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'review-user-vote':
                    $reviewController = new ReviewController();
                    if ($requestMethod == 'get' && isset($parts[3])) {
                        return $reviewController->getUserVote($parts[3]);
                    } else {
                        Response::error('Review ID is required', 400);
                    }
                    break;                case 'upload-picture':
                    $fileController = new FileController();
                    if ($requestMethod == 'post') {
                        $fileController->uploadPicture();
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'delete-picture':
                    $fileController = new FileController();
                    if ($requestMethod == 'delete') {
                        $fileController->deletePicture();
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'profile':
                    $userController = new UserController();
                    if ($requestMethod == 'get') {
                        return $userController->getProfile();
                    } elseif ($requestMethod == 'put') {
                        return $userController->updateProfile();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'roles':
                    $roleController = new RoleController();
                    if ($requestMethod == 'get') {
                        return $roleController->getAllRoles();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'pending-roles':
                    $roleController = new RoleController();
                    if ($requestMethod == 'get') {
                        return $roleController->getAllPendingRoles();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'process-role-request':
                    $roleController = new RoleController();
                    if ($requestMethod == 'post') {
                        return $roleController->processRoleRequest();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'pending-entities':
                    $entityController = new EntityController();
                    if ($requestMethod == 'get') {
                        return $entityController->getPendingEntities();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'update-entity-status':
                    $entityController = new EntityController();
                    if ($requestMethod == 'post') {
                        return $entityController->updateEntityStatus();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'my-entities':
                    $entityController = new EntityController();
                    if ($requestMethod == 'get') {
                        return $entityController->getMyEntities();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'manage-accounts':
                    $userController = new UserController();
                    if ($requestMethod == 'get') {
                        return $userController->getAllUsers();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'delete-user':
                    $userController = new UserController();
                    if ($requestMethod == 'post') {
                        return $userController->deleteUser();
                    } else {
                        header("HTTP/1.0 405 Method Not Allowed");
                        echo json_encode(['error' => 'Method Not Allowed']);
                    }
                    break;
                case 'statistics':
                    $statisticsController = new StatisticsController();
                    if ($requestMethod == 'get') {
                        if (isset($parts[3])) {
                            switch ($parts[3]) {
                                case 'overview':
                                    return $statisticsController->getOverviewStats();
                                case 'most-loved':
                                    return $statisticsController->getMostLovedRankings();
                                case 'most-hated':
                                    return $statisticsController->getMostHatedRankings();
                                case 'cities':
                                    return $statisticsController->getCities();
                                case 'by-city':
                                    $city = $_GET['city'] ?? null;
                                    if (!$city) {
                                        Response::error('City parameter is required', 400);
                                        return;
                                    }
                                    return $statisticsController->getCityRankings($city);
                                default:
                                    Response::error('Invalid statistics endpoint', 404);
                            }
                        } else {
                            Response::error('Statistics endpoint is required', 400);
                        }
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'export':
                    $statisticsController = new StatisticsController();
                    if ($requestMethod == 'get' && isset($parts[3])) {
                        $format = $parts[3]; // csv, pdf, rss

                        switch ($format) {
                            case 'csv':
                                $type = $_GET['type'] ?? 'stats';
                                if ($type === 'rankings') {
                                    return $statisticsController->exportRankings('csv');
                                } else {
                                    return $statisticsController->exportStats('csv');
                                }
                            case 'pdf':
                                $type = $_GET['type'] ?? 'stats';
                                if ($type === 'rankings') {
                                    return $statisticsController->exportRankings('pdf');
                                } else {
                                    return $statisticsController->exportStats('pdf');
                                }
                            case 'rss':
                                return $statisticsController->generateRSSFeed();
                            default:
                                Response::error('Invalid export format', 404);
                        }
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                case 'category':
                    $categoryController = new CategoryController();
                    if ($requestMethod == 'get') {
                        if (isset($parts[3])) {
                            return $categoryController->getCategoryById($parts[3]);
                        } else {
                            Response::error('Category ID is required', 400);
                        }
                    } else {
                        Response::error('Method Not Allowed', 405);
                    }
                    break;
                default:
                    Response::error('404 Not Found', 404);
                    break;
            }
        }
    }
}
