<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Task>
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

        /**
        * @return Task[] Returns an array of Task objects
        */
       public function findTasks(string $order = 'DESC', int $max = 5, int $first = 0): array
       {
           return $this->createQueryBuilder('t')
               ->andWhere('t.deleted_at IS NULL')
               ->orderBy('t.created_at', $order)
               ->setMaxResults($max)
               ->setFirstResult($first)
               ->getQuery()
               ->getArrayResult()
           ;
       }

       /**
        * @return int Returns number of Tasks
        */
        public function countTasks(): int
        {
            return $this->createQueryBuilder('t')
                ->select('COUNT(t.id)')
                ->where('t.deleted_at IS NULL')
                ->getQuery()
                ->getSingleScalarResult()
            ;
        }

    //    public function findOneBySomeField($value): ?Task
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
