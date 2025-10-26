// ======================================================
// Terraform Local File Creation Example
// Practical Assignment No.5
// ======================================================

// Step 1: Define required Terraform version and provider
terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
  }
  required_version = ">= 1.0.0"
}

// Step 2: Configure the local provider
provider "local" {}

// Step 3: Create a folder for our web app source
resource "null_resource" "create_folder" {
  provisioner "local-exec" {
    command = "mkdir -p webapp/src"
  }
}

// Step 4: Create a local JavaScript file using Terraform
resource "local_file" "webapp_index" {
  content = <<-EOT
    const http = require('http');

    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello, Terraform Local File!');
    });

    server.listen(3000, () => {
      console.log('Server running at http://localhost:3000/');
    });
  EOT

  filename = "${path.module}/webapp/src/index.js"

  depends_on = [null_resource.create_folder]
}

// Step 5: Output the file path to confirm creation
output "webapp_file_path" {
  value = local_file.webapp_index.filename
  description = "The path of the generated web app index file"
}