# How to Transfer and Host Your Minecraft Bedrock World on an AWS Free Tier Server

Hosting your own **Minecraft Bedrock** server on an **AWS Free Tier EC2 instance** is a fantastic way to enjoy your custom world with friends, without needing a powerful local machine or paying for a third-party hosting service. This guide walks you through the entire process, from transferring your existing `.mcworld` file to running a dedicated server on AWS, and ensuring it stays online. We'll also address common issues like connectivity and keeping the server running in the background.

---

## Prerequisites

- **Minecraft Bedrock World**: You have an existing `.mcworld` file.
- **AWS Account**: Sign up for the AWS Free Tier at [aws.amazon.com](https://aws.amazon.com).
- **Basic Command Line Knowledge**: Familiarity with SSH and file transfers is helpful but not mandatory.
- **Tools**: A terminal (PuTTY for Windows, Terminal for macOS/Linux, or Git Bash/WSL for Windows) and SCP for file transfers.
- **EC2 Key Pair**: A `.pem` file for SSH access (generated during EC2 setup).

---

## Step 1: Prepare Your Minecraft Bedrock World

Your `.mcworld` file is essentially a ZIP archive containing your world data. Here’s how to prepare it for upload:

1. **Locate or Prepare Your World**:

   - If you have a `.mcworld` file, rename it to `.zip` for easier handling:
     - **Windows Command Prompt**:
       ```bash
       rename your_world.mcworld your_world.zip
       ```
     - **Linux/macOS/Git Bash**:
       ```bash
       mv your_world.mcworld your_world.zip
       ```
   - Unzip the file to extract the world folder:
     ```bash
     unzip your_world.zip -d your_world
     ```
     This creates a folder (e.g., `your_world`) containing files like `level.dat`, `levelname.txt`, and a `db` folder.

2. **Verify World Name**:

   - Open `your_world/levelname.txt` to confirm the world’s name (e.g., `MyWorld`). This will be used later in the server configuration.

3. **Keep the Folder Ready**:
   - The extracted folder (e.g., `your_world`) will be uploaded to your AWS server.

---

## Step 2: Set Up an AWS EC2 Instance (Free Tier)

AWS’s Free Tier offers a `t2.micro` instance, which is sufficient for a small Minecraft Bedrock server.

1. **Log in to AWS Console**:

   - Go to [console.aws.amazon.com](https://console.aws.amazon.com) and sign in.

2. **Launch an EC2 Instance**:

   - Navigate to **EC2** > **Instances** > **Launch Instances**.
   - **Name**: `MinecraftBedrock`.
   - **AMI**: Select **Ubuntu Server 22.04 LTS** (Free Tier eligible).
   - **Instance Type**: Choose `t2.micro`.
   - **Key Pair**:
     - Create a new key pair (e.g., `minecraft_bedrock_server.pem`) or use an existing one.
     - Download and save the `.pem` file securely.
   - **Network Settings**:
     - Click **Edit** under **Network Settings**.
     - Create or select a security group.
     - Add these inbound rules:
       
       | Type | Protocol | Port Range | Source |
       |-------------|----------|------------|------------|
       | SSH | TCP | 22 | 0.0.0.0/0 or My IP |
       | Custom UDP | UDP | 19132 | 0.0.0.0/0 |
       | Custom UDP | UDP | 19133 | 0.0.0.0/0 |
     
     - **Note**: Port 19132 is for IPv4 connections, and 19133 is for IPv6. Allowing SSH from `0.0.0.0/0` is okay for testing but restrict to your IP for security later.
   - **Storage**: Default (8 GB) is fine for Free Tier.
   - Click **Launch Instance**.

3. **Get Your Public IP**:
   - Once the instance is running, note its **Public IPv4 Address** (e.g., `3.92.187.163`).

---

## Step 3: Connect to Your EC2 Instance

1. **Set Permissions for Your Key**: On your local machine, secure your `.pem` file:

   ```bash
   chmod 400 minecraft_bedrock_server.pem
   ```

2. **SSH into Your EC2 Instance**:
   ```bash
   ssh -i minecraft_bedrock_server.pem ubuntu@<your-ec2-public-ip>
   ```
   Replace <your-ec2-public-ip> with your instance’s public IP.

## Step 4: Install Minecraft Bedrock Dedicated Server

1. **Install Dependencies**:
   ```bash
   sudo apt update
   sudo apt install unzip curl tmux -y
   ```
2. **Create a Directory**:
   ```bash
   mkdir ~/bedrock-server
   cd ~/bedrock-server
   ```

3. **Download the Latest Bedrock Server**:

   - Visit minecraft.net/en-us/download/server/bedrock to find the latest version.
   - As of Now (May 2025), the correct link for version 1.21.81.2 is:

   ```bash
   wget https://www.minecraft.net/bedrockdedicatedserver/bin-linux/bedrock-server-1.21.81.2.zip
   ```

4. **Unzip the Server Files**:
   ```bash
   unzip bedrock-server-1.21.81.2.zip
   ```

5. **Set Execute Permissions**:
   ```bash
   chmod +x bedrock_server
   ```

6. **Test the Server**:
   ```bash
   ./bedrock_server
   ```

   Wait for “Server started” in the logs, then stop it with Ctrl + C to configure your world.

## Step 5: Upload Your World to the EC2 Instance

1. **Create the Worlds Directory**: Run this on your EC2 instance
   ```bash
   mkdir -p ~/bedrock-server/worlds
   ```
2. **Upload Your World Folder**: From your local machine (in the directory containing your_world):

   ```bash
   scp -i minecraft_bedrock_server.pem -r your_world ubuntu@<your-ec2-public-ip>:~/bedrock-server/worlds/
   ```

3. **Verify Upload**: SSH back into your EC2 instance and check
   ```bash
   ls ~/bedrock-server/worlds/
   ```

## Step 6: Configure the Server to Use Your World

1. **Edit server.properties**:

   ```bash
   mkdir -p ~/bedrock-server/worlds
   ```

   - Find the line:
     ```bash
     level-name=Bedrock level
     ```
   - Change it to match your world folder name:
     ```bash
     level-name=your_world
     ```
   - Ensure the name matches exactly (case-sensitive).

   - Optional: Adjust other settings like gamemode=survival, difficulty=easy, or server-name=MyServer.

   - Save and exit (Ctrl + O, Enter, Ctrl + X).

2. **Restart the Server**:

   ```bash
   cd ~/bedrock-server
   ./bedrock_server
   ```

## Step 7: Configure the Server to Use Your World

To ensure your server stays online after disconnecting from SSH, use tmux:

1. **Start a tmux Session**:

   ```bash
   tmux new -s minecraft
   ```

2. **Run the server**:

   ```bash
   cd ~/bedrock-server
   ./bedrock_server
   ```

3. **Detach from tmux**:

   - Press `Ctrl + B`, release, then press `D`.
   - This leaves the server running in the background.

4. **Reconnect to tmux Later**:

   ```bash
   tmux attach -t minecraft
   ```

## Step 8: Connect to Your Server

1. **Open Minecraft Bedrock**:
   - On your device (PC, phone, console), go to Play > Servers > Add Server.
   - Enter:
     - Server Name: Anything (e.g., My AWS Server)
     - Server Address: Your EC2 Public IP (e.g., 3.92.187.163)
     - Port: 19132
   - Join and Test:
     - Click Play. If your world loads, you’re set!

You now have a fully functional Minecraft Bedrock server running on AWS, with your custom world loaded and accessible to you and your friends. By using tmux or a systemd service, your server stays online 24/7, and your AWS Free Tier keeps costs at zero (as long as you stay within limits).
If you run into issues or want to add features like custom permissions, operator status, or automated backups, reach out for help!
