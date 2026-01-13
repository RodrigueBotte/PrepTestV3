<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'app_register', methods:['POST'])]
    public function register(Request $rq, EntityManagerInterface $em, UserPasswordHasherInterface $hash): Response
    {
        $data = json_decode($rq->getContent(), true);

        if(!isset($data['email']) || !isset($data['password']) ){
            return new JsonResponse(['Erreur'=> 'Email et mot de passe manquant']);
        }

        $existingEmail = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingEmail) {
            return new JsonResponse(['Erreur'=> 'Email déjà enregistré']);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($hash->hashPassword($user, $data['password']));

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'Utilisateur enregistré']);
    }
}
