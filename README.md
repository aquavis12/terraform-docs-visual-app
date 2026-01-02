# Terraform Infrastructure Visualizer

Multi-cloud drag-and-drop tool to visualize your Terraform infrastructure changes across AWS, Azure, Google Cloud, and more.

## Features

- **Multi-Cloud Support**: Works with AWS, Azure, GCP, DigitalOcean, Kubernetes, and more
- **Dynamic Connectivity**: Extracts actual resource dependencies from your Terraform plan
- **Interactive Visualization**: Click and hover for detailed resource information
- **Professional Design**: Clean, icon-free interface suitable for enterprise environments
- **Auto Documentation**: Generate standard Terraform module documentation
- **Export Options**: Download diagrams as PNG or SVG

## Quick Start

1. **Generate your Terraform plan as JSON:**
   ```bash
   terraform plan -out=tfplan
   terraform show -json tfplan > plan.json
   ```

2. **Open the visualizer:**
   - Drag your `plan.json` file into the drop zone
   - Or click to browse and select your file

3. **Explore your infrastructure:**
   - **Green nodes** = resources being created
   - **Orange nodes** = resources being updated  
   - **Red nodes** = resources being deleted
   - **Purple nodes** = resources being replaced
   - **Lines** show actual dependencies between resources

## What You'll See

### Visual Architecture
- **Hierarchical layout** with logical resource grouping

### Smart Connections
- **Real dependencies** extracted from your Terraform plan
- **Color-coded connections**:
  - Blue: Direct references
  - Orange: Dependencies  
  - Purple: Configuration references

### Interactive Details
- **Hover** for quick resource info and connections
- **Click** for detailed configuration panel
- **Provider badges** show cloud provider (AWS, AZURE, GCP, etc.)

## Multi-Cloud Support

Works seamlessly with:

### AWS Resources
- VPC, EC2, RDS, S3, Lambda, EKS, etc.

### Azure Resources  
- Virtual Networks, VMs, SQL Database, Storage Accounts, AKS, etc.

### Google Cloud Resources
- VPC Networks, Compute Instances, Cloud SQL, GKE, etc.

### Other Providers
- DigitalOcean, Kubernetes, Helm, Docker, and more

## Documentation Generation

Generate professional Terraform module documentation:
- Standard format following CloudPosse conventions
- Automatic input/output detection
- Resource tables with registry links
- Requirements and provider information

## Export Options

- **PNG**: High-quality raster image for presentations
- **SVG**: Vector format for documentation
- **Markdown**: Auto-generated module documentation

## Sample File

Try it with the included `sample-terraform-plan.json` to see:
- Multi-tier AWS architecture
- VPC with public/private subnets
- EC2 instances with security groups
- RDS database with proper connections
- Load balancer configuration

## How It Works

1. **Plan Analysis**: Parses your Terraform JSON plan
2. **Dependency Extraction**: Finds actual resource references and dependencies
3. **Smart Categorization**: Groups resources by type and cloud provider
4. **Visual Layout**: Creates hierarchical architecture diagram
5. **Interactive Enhancement**: Adds hover tooltips and click details

## Professional Design

- Clean, enterprise-ready interface
- No emoji dependencies or visual clutter
- Provider identification through text badges
- Consistent styling across all cloud providers
- Accessibility-friendly design

---


**Perfect for**: DevOps teams, Infrastructure architects, Terraform users, Cloud engineers, and anyone who wants to visualize and document their infrastructure changes before applying them.
