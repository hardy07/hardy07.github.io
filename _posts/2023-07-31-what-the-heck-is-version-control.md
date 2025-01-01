---
layout: post
title: What the heck is version control
description: Learning to Set up git and Learning the most basic and popular commands that are used
date: 2023-07-31 23:02:44 +0530
tags: Version-control
---

## Getting Started

In this blog, We'll try to learn about Version Control and why it is so important before you start working on bigger projects. So, Version Control is a way of keeping track of changes that are made to a file or a set of files over a while.

Especially, if you're collaborating on a project with other programmers, Version Control can be very helpful. It ensures that everyone is working on the same version of the code and It helps you to see a history of changes, who made them, and when they were made. It can easily revert to a previous version if needed. This also prevents people from working on the same issue, which saves more time.

There are various Version Control Systems (VCS) available, but Git is the most popular and is most widely used by programmers around the globe.

Now, we'll directly jump into What is Git?

## What is Git?

<p align="center">
  <img src="/img/VersionControl/git_logo.png" alt="Git Logo" width="200">
</p>

Git - fast, scalable, Distributed Revision Control System

Git is a free and open-source tool that keeps track of changes that you make to your code. It's like having a time machine for your code!

Distributed Revision Control System (DRCS) is a type of VCS that enables developers to work on the same codebase independently and without relying on a central server.

Every time you make changes to a code, Git takes a snapshot of your code and saves it locally, which can be reverted if you needed it.

## Git, GitHub - two different things

Git is a version control system that helps you manage your code and track changes locally on your computer. Whereas GitHub, on the other hand, is a web-based platform that provides hosting services for Git repositories, making it easier for developers to collaborate, share their work, and contribute to open-source projects.

## Installing Git

### Installing Git on Debian-based Linux

```bash
sudo apt install git-all
```

### Installing Git on Arch-based Linux

```bash
sudo pacman -S git
```

### Installing Git on Windows

<p>1. Download the git installer from their</p> [website](https://git-scm.com/download/win).

<p align="center">
  <img src="/img/VersionControl/installer.png" alt="Installer">
</p>

<p> 2. Or if you have winget tool installed in your PC, just run this command</p>

```bash
winget install --id Git.Git -e --source winget
```

<p>3. Download the latest version (2.40.0) which is suitable for the configuration of your PC.</p>

<p>4. Open the setup wizard after downloading.</p>

<p align="center">
  <img src="/img/VersionControl/setup.png" alt="Setup">
</p>

<p>5. Specify the destination folder of your choice, where you would like to install Git.</p>

<p align="center">
  <img src="/img/VersionControl/setup2.png" alt="Setup">
</p>

<p> 6. Let the default or recommended settings be for other options. At last, select Install to install Git on your PC.</p>

<p align="center">
  <img src="/img/VersionControl/setup3.png" alt="Setup">
</p>

<p> 7. After the completion of the installation process, open a git bash and type the following command to check whether Git is installed properly.</p>

```bash
git --version
```

## Staging, Committing, Pushing & Pulling

<p align="center">
  <img src="/img/VersionControl/Git_illustration.webp" alt="Staging">
</p>

1.  To understand these concepts in a better way imagine you are shopping online

2.  **Staging:** Staging is like preparing a shopping cart before checkout. You add items to your cart to decide what you want to buy. Like ways in git, staging is similar; you select specific changes or files that you want to include in your next "purchase" (commit). It's like deciding which changes you want to save in your history.

3.  **Committing:** Committing is like completing your purchase. It's like checking out your shopping cart and finalizing your purchase. Your changes are now saved in the Git history with a message explaining what you changed. It's a snapshot of your work at that specific moment in time.

4.  **Pushing:** Pushing is like sharing your shopping list with others. When you push in Git, you are sending your committed changes to a central server (like GitHub) so that others can see and access your work. It's like sharing your shopping list with friends or family, so they know what you bought.

5.  **Pulling:** Pulling is like updating your shopping list with new items. When you pull in Git, you're fetching changes made by others (like your friends or family adding new items to the shopping list) and bringing those changes into your local copy of the project. It helps you keep your work up-to-date with what others have done.

I hope this example made you understand these concepts well.

## Basic Git commands

1.  Setup git: Sets the global configuration for the user's name in Git
    ```bash
    git config --global user.name “<firstname lastname>”
    ```
    ```bash
    git config --global user.email “<valid-email>”
    ```
2.  For Initializing a new Git repository in current directory
    ```bash
    git init
    ```
3.  Cloning a existing git repository in your local machine
    ```bash
    git clone <url>
    ```
4.  Stages a specific file
    ```bash
    git add <file_name>
    ```
5.  Stages all the changes in the current directory
    ```bash
    git add .
    ```
6.  Committing all new changes which are previously staged

    ```bash
    git commit -m "<commit message>"
    ```

7.  Displays list of commits that are made
    ```bash
    git log
    ```
8.  Shows the current state of the files in the repo whether they are committed, staged or untracked

    ```bash
    git status
    ```

9.  Pushes the committed changes to the remote repository named origin in main branch

    ```bash
    git push origin main
    ```

10. Linking your local repository to a remote repository for pushing and pulling changes to your Github account

    ```bash
    git remote add origin <repo_link>
    ```

11. Pushes the committed changes to the remote repository named origin in main branch
    ```bash
    git push -u origin main
    ```
