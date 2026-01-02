class TerraformDocsGenerator {
    constructor() {
        this.serviceConfig = {
            'aws_vpc': { icon: '🌐', name: 'VPC' },
            'aws_internet_gateway': { icon: '🌍', name: 'Internet Gateway' },
            'aws_subnet': { icon: '📡', name: 'Subnet' },
            'aws_security_group': { icon: '🛡️', name: 'Security Group' },
            'aws_instance': { icon: '💻', name: 'EC2 Instance' },
            'aws_launch_template': { icon: '📋', name: 'Launch Template' },
            'aws_lb': { icon: '⚖️', name: 'Load Balancer' },
            'aws_alb': { icon: '⚖️', name: 'Application Load Balancer' },
            'aws_elb': { icon: '⚖️', name: 'Classic Load Balancer' },
            'aws_s3_bucket': { icon: '🪣', name: 'S3 Bucket' },
            'aws_rds_instance': { icon: '🗄️', name: 'RDS Database' },
            'aws_rds_cluster': { icon: '🗄️', name: 'RDS Cluster' },
            'aws_key_pair': { icon: '🔑', name: 'Key Pair' },
            'aws_iam_role': { icon: '👤', name: 'IAM Role' },
            'aws_iam_policy': { icon: '📜', name: 'IAM Policy' },
            'aws_lambda_function': { icon: 'λ', name: 'Lambda Function' },
            'aws_route_table': { icon: '🛣️', name: 'Route Table' },
            'aws_nat_gateway': { icon: '🚪', name: 'NAT Gateway' },
            'aws_eip': { icon: '🌐', name: 'Elastic IP' },
            'aws_cloudfront_distribution': { icon: '☁️', name: 'CloudFront' },
            'aws_route53_zone': { icon: '🌍', name: 'Route53 Zone' },
            'aws_acm_certificate': { icon: '🔒', name: 'SSL Certificate' },
            'aws_autoscaling_group': { icon: '📈', name: 'Auto Scaling Group' },
            'aws_launch_configuration': { icon: '⚙️', name: 'Launch Configuration' },
            'aws_ebs_volume': { icon: '💾', name: 'EBS Volume' },
            'aws_sns_topic': { icon: '📢', name: 'SNS Topic' },
            'aws_sqs_queue': { icon: '📬', name: 'SQS Queue' },
            'aws_dynamodb_table': { icon: '🗃️', name: 'DynamoDB Table' },
            'aws_elasticache_cluster': { icon: '⚡', name: 'ElastiCache' },
            'aws_elasticsearch_domain': { icon: '🔍', name: 'Elasticsearch' },
            'aws_kinesis_stream': { icon: '🌊', name: 'Kinesis Stream' },
            'aws_api_gateway_rest_api': { icon: '🔌', name: 'API Gateway' },
            'aws_cloudwatch_log_group': { icon: '📊', name: 'CloudWatch Logs' },
            'aws_ecr_repository': { icon: '📦', name: 'ECR Repository' },
            'aws_ecs_cluster': { icon: '🐳', name: 'ECS Cluster' },
            'aws_ecs_service': { icon: '🚀', name: 'ECS Service' },
            'aws_eks_cluster': { icon: '☸️', name: 'EKS Cluster' },
            'aws_rds_subnet_group': { icon: '🗄️', name: 'DB Subnet Group' },
            'aws_db_parameter_group': { icon: '⚙️', name: 'DB Parameter Group' }
        };
    }

    getServiceName(type) {
        return this.serviceConfig[type]?.name || this.formatGenericName(type);
    }

    formatGenericName(type) {
        return type
            .replace(/^aws_/, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    generateTerraformDocs(data, nodes) {
        const timestamp = new Date().toISOString().split('T')[0];
        
        let docs = `# Infrastructure Documentation

This Terraform configuration creates and manages AWS infrastructure resources.

## Usage

\`\`\`hcl
module "infrastructure" {
  source = "./path/to/module"
  
  # Required variables
  vpc_cidr = "10.0.0.0/16"
  
  # Optional variables
  tags = {
    Environment = "production"
    Project     = "my-project"
  }
}
\`\`\`

## Examples

### Minimal Example

\`\`\`hcl
module "infrastructure" {
  source = "./path/to/module"
  
  vpc_cidr = "10.0.0.0/16"
}
\`\`\`

### Complete Example

\`\`\`hcl
module "infrastructure" {
  source = "./path/to/module"
  
  vpc_cidr          = "10.0.0.0/16"
  availability_zones = ["us-west-2a", "us-west-2b"]
  instance_type     = "t3.medium"
  
  tags = {
    Environment = "production"
    Project     = "my-project"
    Owner       = "platform-team"
  }
}
\`\`\`

`;
        docs += this.generateRequirements();
        docs += this.generateProviders();
        docs += this.generateModules();
        docs += this.generateResourcesTable(nodes);
        docs += this.generateInputs(nodes);
        docs += this.generateOutputs(nodes);
        docs += this.generateFooter();
        
        return docs;
    }

    generateRequirements() {
        return `## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement_aws) | >= 4.0 |

`;
    }

    generateProviders() {
        return `## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider_aws) | >= 4.0 |

`;
    }

    generateModules() {
        return `## Modules

No modules.

`;
    }

    generateResourcesTable(nodes) {
        if (nodes.length === 0) {
            return `## Resources

No resources.

`;
        }

        let resources = `## Resources

| Name | Type |
|------|------|
`;

        // Sort resources by type for better organization
        const sortedNodes = nodes.sort((a, b) => {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            return a.name.localeCompare(b.name);
        });

        sortedNodes.forEach(resource => {
            const name = resource.name || 'unnamed';
            const type = resource.type;
            const resourceLink = `<a name="resource_${name}"></a> [${name}](#resource_${name})`;
            const typeLink = `https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/${type.replace('aws_', '')}`;
            resources += `| ${resourceLink} | [${type}](${typeLink}) |\n`;
        });

        resources += '\n';
        return resources;
    }

    generateInputs(nodes) {
        // Extract actual variables from the resources
        const detectedInputs = new Map();
        
        nodes.forEach(node => {
            const config = node.resource.change?.after || node.resource.change?.before || {};
            
            // Analyze configuration to detect likely variables
            Object.entries(config).forEach(([key, value]) => {
                if (this.isLikelyVariable(key, value, node.type)) {
                    const inputInfo = this.getInputInfo(key, value, node.type);
                    if (inputInfo && !detectedInputs.has(inputInfo.name)) {
                        detectedInputs.set(inputInfo.name, inputInfo);
                    }
                }
            });
        });

        let inputsTable = `## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
`;

        if (detectedInputs.size === 0) {
            inputsTable += `| n/a | n/a | n/a | n/a | n/a |

`;
        } else {
            // Sort inputs alphabetically
            const sortedInputs = Array.from(detectedInputs.values()).sort((a, b) => a.name.localeCompare(b.name));
            
            sortedInputs.forEach(input => {
                const nameLink = `<a name="input_${input.name}"></a> [${input.name}](#input_${input.name})`;
                const required = input.required ? 'yes' : 'no';
                inputsTable += `| ${nameLink} | ${input.description} | \`${input.type}\` | \`${input.default}\` | ${required} |\n`;
            });
            inputsTable += '\n';
        }

        return inputsTable;
    }

    isLikelyVariable(key, value, resourceType) {
        // Skip computed/read-only attributes
        const computedFields = ['id', 'arn', 'dns_name', 'zone_id', 'hosted_zone_id', 'owner_id', 'state'];
        if (computedFields.includes(key)) return false;
        
        // Skip complex nested objects that are usually computed
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) return false;
        
        // Include common configurable fields
        const configurableFields = [
            'cidr_block', 'instance_type', 'ami', 'availability_zone', 'availability_zones',
            'name', 'description', 'tags', 'key_name', 'security_groups', 'subnet_id',
            'vpc_id', 'engine', 'engine_version', 'instance_class', 'allocated_storage',
            'db_name', 'username', 'password', 'backup_retention_period', 'multi_az'
        ];
        
        return configurableFields.includes(key) || key.includes('_name') || key.includes('_id');
    }

    getInputInfo(key, value, resourceType) {
        const inputMap = {
            'cidr_block': {
                name: 'vpc_cidr',
                description: 'CIDR block for the VPC',
                type: 'string',
                default: '"10.0.0.0/16"',
                required: false
            },
            'instance_type': {
                name: 'instance_type',
                description: 'EC2 instance type',
                type: 'string',
                default: '"t3.micro"',
                required: false
            },
            'ami': {
                name: 'ami_id',
                description: 'AMI ID for EC2 instances',
                type: 'string',
                default: 'null',
                required: true
            },
            'availability_zone': {
                name: 'availability_zones',
                description: 'List of availability zones',
                type: 'list(string)',
                default: '[]',
                required: false
            },
            'tags': {
                name: 'tags',
                description: 'A map of tags to assign to the resource',
                type: 'map(string)',
                default: '{}',
                required: false
            },
            'key_name': {
                name: 'key_pair_name',
                description: 'Name of the AWS key pair',
                type: 'string',
                default: 'null',
                required: false
            },
            'engine': {
                name: 'db_engine',
                description: 'Database engine',
                type: 'string',
                default: '"mysql"',
                required: false
            },
            'instance_class': {
                name: 'db_instance_class',
                description: 'RDS instance class',
                type: 'string',
                default: '"db.t3.micro"',
                required: false
            }
        };

        return inputMap[key] || {
            name: key,
            description: `${this.formatKeyName(key)} configuration`,
            type: this.inferType(value),
            default: this.formatDefault(value),
            required: false
        };
    }

    inferType(value) {
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'bool';
        if (Array.isArray(value)) return 'list(string)';
        if (typeof value === 'object') return 'map(string)';
        return 'string';
    }

    formatDefault(value) {
        if (value === null || value === undefined) return 'null';
        if (typeof value === 'string') return `"${value}"`;
        if (Array.isArray(value)) return JSON.stringify(value);
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }

    formatKeyName(key) {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    generateOutputs(nodes) {
        // Generate realistic outputs based on the resources
        const outputs = new Map();
        
        nodes.forEach(node => {
            const type = node.type;
            const name = node.name;
            
            // Generate appropriate outputs for each resource type
            if (type === 'aws_vpc') {
                outputs.set('vpc_id', {
                    name: 'vpc_id',
                    description: 'ID of the VPC'
                });
                outputs.set('vpc_cidr_block', {
                    name: 'vpc_cidr_block',
                    description: 'CIDR block of the VPC'
                });
            } else if (type === 'aws_subnet') {
                outputs.set('subnet_ids', {
                    name: 'subnet_ids',
                    description: 'IDs of the subnets'
                });
            } else if (type === 'aws_security_group') {
                outputs.set('security_group_ids', {
                    name: 'security_group_ids',
                    description: 'IDs of the security groups'
                });
            } else if (type === 'aws_instance') {
                outputs.set('instance_ids', {
                    name: 'instance_ids',
                    description: 'IDs of the EC2 instances'
                });
                outputs.set('instance_public_ips', {
                    name: 'instance_public_ips',
                    description: 'Public IP addresses of the EC2 instances'
                });
            } else if (type === 'aws_lb') {
                outputs.set('load_balancer_dns_name', {
                    name: 'load_balancer_dns_name',
                    description: 'DNS name of the load balancer'
                });
                outputs.set('load_balancer_arn', {
                    name: 'load_balancer_arn',
                    description: 'ARN of the load balancer'
                });
            } else if (type.includes('rds')) {
                outputs.set('db_instance_endpoint', {
                    name: 'db_instance_endpoint',
                    description: 'RDS instance endpoint'
                });
                outputs.set('db_instance_id', {
                    name: 'db_instance_id',
                    description: 'RDS instance ID'
                });
            } else if (type === 'aws_s3_bucket') {
                outputs.set('s3_bucket_id', {
                    name: 's3_bucket_id',
                    description: 'Name of the S3 bucket'
                });
                outputs.set('s3_bucket_arn', {
                    name: 's3_bucket_arn',
                    description: 'ARN of the S3 bucket'
                });
            }
        });

        let outputsTable = `## Outputs

| Name | Description |
|------|-------------|
`;

        if (outputs.size === 0) {
            outputsTable += `| n/a | n/a |

`;
        } else {
            // Sort outputs alphabetically
            const sortedOutputs = Array.from(outputs.values()).sort((a, b) => a.name.localeCompare(b.name));
            
            sortedOutputs.forEach(output => {
                const nameLink = `<a name="output_${output.name}"></a> [${output.name}](#output_${output.name})`;
                outputsTable += `| ${nameLink} | ${output.description} |\n`;
            });
            outputsTable += '\n';
        }

        return outputsTable;
    }

    generateFooter() {
        return `## Authors

Module is maintained by [Your Team](https://github.com/your-org/terraform-modules).

## License

Apache 2 Licensed. See [LICENSE](https://github.com/your-org/terraform-modules/tree/main/LICENSE) for full details.
`;
    }
}

// Export for use in main visualizer
window.TerraformDocsGenerator = TerraformDocsGenerator;