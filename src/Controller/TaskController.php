<?php

namespace App\Controller;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class TaskController extends AbstractController
{
    #[Route('/task', name: 'app_task')]
    public function index(): Response
    {
        return $this->render('task/index.html.twig', [
            'controller_name' => 'TaskController',
        ]);
    }

    #[Route('/tasks', name: 'list_tasks', methods: ['GET'])]
    public function list(TaskRepository $taskRepository, Request $request): JsonResponse
    {
        /**
         * Calculate pagination
         */
        $page = max(1, $request->query->getInt('page', 1)); // Get page number or revert to 1
        $max = 5; // Max entries per page
        $skip = ($page - 1) * $max; // Skip records from previous page

        $tasks = $taskRepository->findTasks('DESC', $max, $skip);

        return new JsonResponse(['tasks' => $tasks, 'page' => $page]);
    }

    #[Route('/tasks', name: 'create_task', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $emi): JsonResponse
    {
        $title = $request->request->get('title');

        if (!$title) {
            return new JsonResponse(['error' => 'Title is required'], Response::HTTP_BAD_REQUEST);
        }

        $task = new Task();
        $task->setTitle($title);

        $emi->persist($task);
        $emi->flush();

        return new JsonResponse(['id' => $task->getId(), 'title' => $task->getTitle(), 'is_done' => $task->isDone()]);
    }

    #[Route('/{id}/toggle', name: 'toggle_task', methods: ['POST'])]
    public function toggle(Task $task, Request $request, EntityManagerInterface $emi): JsonResponse
    {
        $task->setIsDone(!$task->isDone());

        $emi->flush();

        return new JsonResponse(['id' => $task->getId(), 'is_done' => $task->isDone()]);
    }

    #[Route('/{id}/delete', name: 'delete_task', methods: ['POST'])]
    public function delete(Task $task, Request $request, EntityManagerInterface $emi): JsonResponse
    {
        $task->setDeletedAt(new \DateTime());

        $emi->flush();

        return new JsonResponse(['id' => $task->getId(), 'deleted' => true]);
    }
}
