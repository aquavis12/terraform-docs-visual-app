class TerraformVisualizer {
    constructor() {
        this.data = null;
        this.svg = null;
        this.width = 1600;
        this.height = 850;
        this.cachedNodes = null;
        
        // Consolidated action styles - single source of truth
        this.actionStyles = {
            create: { primary: '#10b981', border: '#34d399', badge: '#059669', node: 'rgba(16, 185, 129, 0.9)' },
            update: { primary: '#f59e0b', border: '#fbbf24', badge: '#d97706', node: 'rgba(245, 158, 11, 0.9)' },
            delete: { primary: '#ef4444', border: '#f87171', badge: '#dc2626', node: 'rgba(239, 68, 68, 0.9)' },
            replace: { primary: '#8b5cf6', border: '#a78bfa', badge: '#7c3aed', node: 'rgba(139, 92, 246, 0.9)' },
            'no-op': { primary: '#6b7280', border: '#9ca3af', badge: '#6b7280', node: 'rgba(107, 114, 128, 0.9)' },
            read: { primary: '#06b6d4', border: '#22d3ee', badge: '#0891b2', node: 'rgba(6, 182, 212, 0.9)' }
        };

        // Multi-cloud service names - supports AWS, Azure, GCP, and others (no icons)
        this.serviceConfig = {
            // AWS Resources
            'aws_vpc': { name: 'VPC', provider: 'aws' },
            'aws_internet_gateway': { name: 'Internet Gateway', provider: 'aws' },
            'aws_subnet': { name: 'Subnet', provider: 'aws' },
            'aws_security_group': { name: 'Security Group', provider: 'aws' },
            'aws_instance': { name: 'EC2 Instance', provider: 'aws' },
            'aws_launch_template': { name: 'Launch Template', provider: 'aws' },
            'aws_lb': { name: 'Load Balancer', provider: 'aws' },
            'aws_alb': { name: 'Application Load Balancer', provider: 'aws' },
            'aws_elb': { name: 'Classic Load Balancer', provider: 'aws' },
            'aws_s3_bucket': { name: 'S3 Bucket', provider: 'aws' },
            'aws_rds_instance': { name: 'RDS Database', provider: 'aws' },
            'aws_rds_cluster': { name: 'RDS Cluster', provider: 'aws' },
            'aws_key_pair': { name: 'Key Pair', provider: 'aws' },
            'aws_iam_role': { name: 'IAM Role', provider: 'aws' },
            'aws_iam_policy': { name: 'IAM Policy', provider: 'aws' },
            'aws_lambda_function': { name: 'Lambda Function', provider: 'aws' },
            'aws_route_table': { name: 'Route Table', provider: 'aws' },
            'aws_nat_gateway': { name: 'NAT Gateway', provider: 'aws' },
            'aws_eip': { name: 'Elastic IP', provider: 'aws' },
            'aws_cloudfront_distribution': { name: 'CloudFront', provider: 'aws' },
            'aws_route53_zone': { name: 'Route53 Zone', provider: 'aws' },
            'aws_acm_certificate': { name: 'SSL Certificate', provider: 'aws' },
            'aws_autoscaling_group': { name: 'Auto Scaling Group', provider: 'aws' },
            'aws_launch_configuration': { name: 'Launch Configuration', provider: 'aws' },
            'aws_ebs_volume': { name: 'EBS Volume', provider: 'aws' },
            'aws_sns_topic': { name: 'SNS Topic', provider: 'aws' },
            'aws_sqs_queue': { name: 'SQS Queue', provider: 'aws' },
            'aws_dynamodb_table': { name: 'DynamoDB Table', provider: 'aws' },
            'aws_elasticache_cluster': { name: 'ElastiCache', provider: 'aws' },
            'aws_elasticsearch_domain': { name: 'Elasticsearch', provider: 'aws' },
            'aws_kinesis_stream': { name: 'Kinesis Stream', provider: 'aws' },
            'aws_api_gateway_rest_api': { name: 'API Gateway', provider: 'aws' },
            'aws_cloudwatch_log_group': { name: 'CloudWatch Logs', provider: 'aws' },
            'aws_ecr_repository': { name: 'ECR Repository', provider: 'aws' },
            'aws_ecs_cluster': { name: 'ECS Cluster', provider: 'aws' },
            'aws_ecs_service': { name: 'ECS Service', provider: 'aws' },
            'aws_eks_cluster': { name: 'EKS Cluster', provider: 'aws' },
            'aws_rds_subnet_group': { name: 'DB Subnet Group', provider: 'aws' },
            'aws_db_parameter_group': { name: 'DB Parameter Group', provider: 'aws' },

            // Azure Resources
            'azurerm_virtual_network': { name: 'Virtual Network', provider: 'azure' },
            'azurerm_subnet': { name: 'Subnet', provider: 'azure' },
            'azurerm_network_security_group': { name: 'Network Security Group', provider: 'azure' },
            'azurerm_virtual_machine': { name: 'Virtual Machine', provider: 'azure' },
            'azurerm_linux_virtual_machine': { name: 'Linux VM', provider: 'azure' },
            'azurerm_windows_virtual_machine': { name: 'Windows VM', provider: 'azure' },
            'azurerm_load_balancer': { name: 'Load Balancer', provider: 'azure' },
            'azurerm_application_gateway': { name: 'Application Gateway', provider: 'azure' },
            'azurerm_storage_account': { name: 'Storage Account', provider: 'azure' },
            'azurerm_sql_server': { name: 'SQL Server', provider: 'azure' },
            'azurerm_sql_database': { name: 'SQL Database', provider: 'azure' },
            'azurerm_cosmosdb_account': { name: 'Cosmos DB', provider: 'azure' },
            'azurerm_key_vault': { name: 'Key Vault', provider: 'azure' },
            'azurerm_function_app': { name: 'Function App', provider: 'azure' },
            'azurerm_app_service': { name: 'App Service', provider: 'azure' },
            'azurerm_container_registry': { name: 'Container Registry', provider: 'azure' },
            'azurerm_kubernetes_cluster': { name: 'AKS Cluster', provider: 'azure' },
            'azurerm_public_ip': { name: 'Public IP', provider: 'azure' },
            'azurerm_network_interface': { name: 'Network Interface', provider: 'azure' },
            'azurerm_resource_group': { name: 'Resource Group', provider: 'azure' },

            // Google Cloud Resources
            'google_compute_network': { name: 'VPC Network', provider: 'gcp' },
            'google_compute_subnetwork': { name: 'Subnetwork', provider: 'gcp' },
            'google_compute_firewall': { name: 'Firewall Rule', provider: 'gcp' },
            'google_compute_instance': { name: 'Compute Instance', provider: 'gcp' },
            'google_compute_instance_template': { name: 'Instance Template', provider: 'gcp' },
            'google_compute_target_pool': { name: 'Target Pool', provider: 'gcp' },
            'google_compute_forwarding_rule': { name: 'Forwarding Rule', provider: 'gcp' },
            'google_storage_bucket': { name: 'Cloud Storage', provider: 'gcp' },
            'google_sql_database_instance': { name: 'Cloud SQL', provider: 'gcp' },
            'google_container_cluster': { name: 'GKE Cluster', provider: 'gcp' },
            'google_cloudfunctions_function': { name: 'Cloud Function', provider: 'gcp' },
            'google_compute_router': { name: 'Cloud Router', provider: 'gcp' },
            'google_compute_nat_gateway': { name: 'Cloud NAT', provider: 'gcp' },
            'google_project_service': { name: 'API Service', provider: 'gcp' },

            // Other Cloud Providers
            'digitalocean_droplet': { name: 'Droplet', provider: 'digitalocean' },
            'digitalocean_vpc': { name: 'VPC', provider: 'digitalocean' },
            'digitalocean_loadbalancer': { name: 'Load Balancer', provider: 'digitalocean' },
            'digitalocean_database_cluster': { name: 'Database Cluster', provider: 'digitalocean' },
            'digitalocean_spaces_bucket': { name: 'Spaces Bucket', provider: 'digitalocean' },

            // Kubernetes Resources
            'kubernetes_deployment': { name: 'Deployment', provider: 'kubernetes' },
            'kubernetes_service': { name: 'Service', provider: 'kubernetes' },
            'kubernetes_ingress': { name: 'Ingress', provider: 'kubernetes' },
            'kubernetes_namespace': { name: 'Namespace', provider: 'kubernetes' },
            'kubernetes_config_map': { name: 'ConfigMap', provider: 'kubernetes' },
            'kubernetes_secret': { name: 'Secret', provider: 'kubernetes' },

            // Generic/Other Resources
            'helm_release': { name: 'Helm Release', provider: 'helm' },
            'docker_image': { name: 'Docker Image', provider: 'docker' },
            'docker_container': { name: 'Container', provider: 'docker' }
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');

        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone.addEventListener('drop', this.handleDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.data = JSON.parse(e.target.result);
                this.visualize();
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    visualize() {
        document.getElementById('drop-zone').style.display = 'none';
        document.getElementById('visualization-container').style.display = 'block';

        this.createStats();
        this.createLegend();
        this.createVisualization();
    }

    createStats() {
        const stats = this.calculateStats();
        const statsPanel = document.getElementById('stats-panel');
        
        statsPanel.innerHTML = Object.entries(stats).map(([key, value]) => `
            <div class="stat-card">
                <div class="stat-number">${value}</div>
                <div class="stat-label">${key.replace('_', ' ').toUpperCase()}</div>
            </div>
        `).join('');
    }

    calculateStats() {
        if (!this.data.resource_changes) return {};

        const stats = {
            total_resources: this.data.resource_changes.length,
            create: 0,
            update: 0,
            delete: 0,
            replace: 0,
            'no-op': 0
        };

        this.data.resource_changes.forEach(resource => {
            const actions = resource.change?.actions || ['no-op'];
            const primaryAction = this.getPrimaryAction(actions);
            stats[primaryAction]++;
        });

        return stats;
    }

    getPrimaryAction(actions) {
        if (actions.includes('delete') && actions.includes('create')) return 'replace';
        if (actions.includes('create')) return 'create';
        if (actions.includes('update')) return 'update';
        if (actions.includes('delete')) return 'delete';
        if (actions.includes('read')) return 'read';
        return 'no-op';
    }

    createLegend() {
        const legend = document.getElementById('legend');
        
        // Simple action legend using consolidated styles
        const actionItems = Object.entries(this.actionStyles).map(([action, style]) => `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${style.primary}"></div>
                <span>${action.replace('-', ' ').toUpperCase()}</span>
            </div>
        `).join('');

        legend.innerHTML = `
            <h4>What the colors mean:</h4>
            <div class="legend-section">
                ${actionItems}
            </div>
        `;
    }

    createVisualization() {
        const container = document.getElementById('visualization');
        container.innerHTML = '';

        this.svg = d3.select('#visualization')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('background', '#0f172a');

        const defs = this.svg.append('defs');
        
        // Add subtle grid pattern
        const pattern = defs.append('pattern')
            .attr('id', 'grid')
            .attr('width', 30)
            .attr('height', 30)
            .attr('patternUnits', 'userSpaceOnUse');
        
        pattern.append('path')
            .attr('d', 'M 30 0 L 0 0 0 30')
            .attr('fill', 'none')
            .attr('stroke', 'rgba(255,255,255,0.03)')
            .attr('stroke-width', 1);

        this.svg.append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'url(#grid)');

        const nodes = this.prepareNodes();
        const links = this.prepareLinks(nodes);

        this.drawCleanArchitecture(nodes, links);
        this.setupEnhancedTooltip();
    }
    drawCleanArchitecture(nodes, links) {
        // Calculate smart positions using hierarchical layout
        const { positions, hierarchy } = this.calculateHierarchicalPositions(nodes);
        
        // Draw connections based on actual plan data
        this.drawLayerConnections(hierarchy, positions);
        
        // Draw nodes without icons
        this.drawCleanNodes(nodes, positions);
    }

    calculateHierarchicalPositions(nodes) {
        const positions = {};
        const centerX = this.width / 2;
        
        // Define hierarchy levels
        const hierarchy = {
            level1: [], // VPC, Internet Gateway, Route53
            level2: [], // Subnets and Network Components
            level3: [], // Security, Load Balancing, and Access Control
            level4: [], // Compute Resources
            level5: [], // Data and Storage
            level6: []  // Everything else
        };

        // Categorize nodes dynamically
        nodes.forEach(node => {
            const type = node.type.toLowerCase();
            
            // Level 1: Network Core (VPC, Internet Gateway, Route53)
            if (type.includes('vpc') || type.includes('virtual_network') || type.includes('compute_network') || 
                type.includes('internet_gateway') || type.includes('route53')) {
                hierarchy.level1.push(node);
            }
            // Level 2: Subnets and Network Components
            else if (type.includes('subnet') || type.includes('subnetwork') || type.includes('route_table') || 
                     type.includes('nat_gateway') || type.includes('eip') || type.includes('public_ip')) {
                hierarchy.level2.push(node);
            }
            // Level 3: Security, Load Balancing, and Access Control
            else if (type.includes('security_group') || type.includes('network_security_group') || 
                     type.includes('firewall') || type.includes('lb') || type.includes('load_balancer') ||
                     type.includes('key_pair') || type.includes('iam') || type.includes('acm') || 
                     type.includes('certificate') || type.includes('key_vault')) {
                hierarchy.level3.push(node);
            }
            // Level 4: Compute Resources
            else if (type.includes('instance') || type.includes('virtual_machine') || 
                     type.includes('launch_template') || type.includes('launch_configuration') ||
                     type.includes('autoscaling') || type.includes('ecs') || type.includes('eks') || 
                     type.includes('kubernetes_cluster') || type.includes('container_cluster') ||
                     type.includes('lambda') || type.includes('function') || type.includes('app_service')) {
                hierarchy.level4.push(node);
            }
            // Level 5: Data and Storage
            else if (type.includes('rds') || type.includes('sql') || type.includes('cosmosdb') ||
                     type.includes('s3') || type.includes('storage') || type.includes('dynamodb') || 
                     type.includes('ebs') || type.includes('elasticache') || type.includes('elasticsearch') || 
                     type.includes('ecr') || type.includes('container_registry')) {
                hierarchy.level5.push(node);
            }
            // Level 6: Everything else (APIs, Monitoring, Messaging, etc.)
            else {
                hierarchy.level6.push(node);
            }
        });

        // Calculate dynamic spacing based on content
        const levelY = { level1: 100, level2: 220, level3: 340, level4: 480, level5: 620, level6: 760 };
        const nodeWidth = 190;
        const nodeSpacing = 25;
        const leftMargin = 50; // Reduced margin since no layer labels

        Object.entries(hierarchy).forEach(([level, levelNodes]) => {
            if (levelNodes.length === 0) return;

            const y = levelY[level];
            const availableWidth = this.width - leftMargin - 50;
            const totalWidth = levelNodes.length * nodeWidth + (levelNodes.length - 1) * nodeSpacing;
            const startX = leftMargin + (availableWidth - totalWidth) / 2 + nodeWidth / 2;

            levelNodes.forEach((node, index) => {
                positions[node.id] = {
                    x: startX + index * (nodeWidth + nodeSpacing),
                    y: y
                };
                node.x = positions[node.id].x;
                node.y = positions[node.id].y;
                node.level = level;
            });
        });

        return { positions, hierarchy };
    }

    drawLayerConnections(hierarchy, positions) {
        const linkGroup = this.svg.append('g').attr('class', 'links');
        const labelGroup = this.svg.append('g').attr('class', 'layer-labels');

        // Add multiple arrow markers for different connection types
        const defs = this.svg.select('defs');
        
        // Standard arrow
        defs.append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-3L8,0L0,3')
            .attr('fill', '#38bdf8');

        // Dependency arrow (orange)
        defs.append('marker')
            .attr('id', 'arrow-dependency')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-3L8,0L0,3')
            .attr('fill', '#f59e0b');

        // Reference arrow (purple)
        defs.append('marker')
            .attr('id', 'arrow-reference')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-3L8,0L0,3')
            .attr('fill', '#8b5cf6');

        // Layer labels removed for cleaner interface

        // Extract actual connections from Terraform plan
        const connections = this.extractConnectionsFromPlan();
        const drawnLinks = new Set();

        // Draw connections based on actual Terraform dependencies
        connections.forEach(connection => {
            this.drawConnection(
                connection.source, 
                connection.target, 
                linkGroup, 
                positions, 
                drawnLinks, 
                connection.color, 
                connection.markerType
            );
        });

        // Add connection legend
        this.addConnectionLegend(labelGroup);
    }
    extractConnectionsFromPlan() {
        const connections = [];
        const allNodes = this.cachedNodes || [];
        const nodeMap = new Map();
        
        // Create a map for quick node lookup
        allNodes.forEach(node => {
            nodeMap.set(node.id, node);
        });

        // 1. Extract connections from resource_changes (most reliable)
        if (this.data.resource_changes) {
            this.data.resource_changes.forEach(resource => {
                const sourceNode = nodeMap.get(resource.address);
                if (!sourceNode) return;

                // Extract from configuration values
                const config = resource.change?.after || resource.change?.before || {};
                this.extractConfigurationReferences(config, sourceNode, nodeMap, connections);

                // Extract from prior_state if available
                if (resource.change?.before) {
                    this.extractConfigurationReferences(resource.change.before, sourceNode, nodeMap, connections);
                }
            });
        }

        // 2. Extract connections from configuration (Terraform expressions)
        if (this.data.configuration && this.data.configuration.root_module) {
            this.extractConfigurationConnections(this.data.configuration.root_module, nodeMap, connections);
        }

        // 3. Extract connections from planned_values
        if (this.data.planned_values && this.data.planned_values.root_module) {
            this.extractPlannedValueConnections(this.data.planned_values.root_module, nodeMap, connections);
        }

        // 4. Extract connections from prior_state if available
        if (this.data.prior_state && this.data.prior_state.values && this.data.prior_state.values.root_module) {
            this.extractPlannedValueConnections(this.data.prior_state.values.root_module, nodeMap, connections);
        }

        // Remove duplicate connections
        const uniqueConnections = this.removeDuplicateConnections(connections);
        
        // Debug logging to help verify connections
        this.logConnectionsDebug(uniqueConnections, nodeMap);
        
        console.log(`Extracted ${uniqueConnections.length} unique connections from plan`);
        return uniqueConnections;
    }

    logConnectionsDebug(connections, nodeMap) {
        if (connections.length === 0) {
            console.warn('No connections found in Terraform plan. This might indicate:');
            console.warn('1. Resources are independent with no references');
            console.warn('2. Plan JSON structure is different than expected');
            console.warn('3. Connection extraction logic needs adjustment');
            
            // Log available data structure for debugging
            console.log('Available plan sections:', Object.keys(this.data));
            if (this.data.resource_changes && this.data.resource_changes.length > 0) {
                console.log('Sample resource_change structure:', 
                    JSON.stringify(this.data.resource_changes[0], null, 2).substring(0, 500) + '...');
            }
        } else {
            console.log('Connection summary:');
            const connectionTypes = {};
            connections.forEach(conn => {
                connectionTypes[conn.type] = (connectionTypes[conn.type] || 0) + 1;
            });
            console.table(connectionTypes);
            
            // Log first few connections for verification
            console.log('Sample connections:', connections.slice(0, 3).map(conn => ({
                from: conn.source.id,
                to: conn.target.id,
                type: conn.type,
                property: conn.property
            })));
        }
    }

    removeDuplicateConnections(connections) {
        const seen = new Set();
        return connections.filter(conn => {
            const key = `${conn.source.id}->${conn.target.id}-${conn.property || ''}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    extractConfigurationReferences(config, sourceNode, nodeMap, connections) {
        if (!config || typeof config !== 'object') return;

        // Recursively search through all configuration values
        Object.entries(config).forEach(([key, value]) => {
            this.searchForReferences(value, key, sourceNode, nodeMap, connections);
        });
    }

    searchForReferences(value, propertyName, sourceNode, nodeMap, connections) {
        if (typeof value === 'string') {
            // Look for resource references in strings
            const resourceRefs = this.findResourceReferences(value);
            resourceRefs.forEach(ref => {
                const targetNode = nodeMap.get(ref);
                if (targetNode && targetNode.id !== sourceNode.id) {
                    connections.push({
                        source: targetNode,
                        target: sourceNode,
                        type: 'reference',
                        color: '#8b5cf6',
                        markerType: 'arrow-reference',
                        property: propertyName
                    });
                }
            });
        } else if (Array.isArray(value)) {
            // Search through array elements
            value.forEach((item, index) => {
                this.searchForReferences(item, `${propertyName}[${index}]`, sourceNode, nodeMap, connections);
            });
        } else if (value && typeof value === 'object') {
            // Recursively search through nested objects
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                this.searchForReferences(nestedValue, `${propertyName}.${nestedKey}`, sourceNode, nodeMap, connections);
            });
        }
    }

    extractConfigurationConnections(module, nodeMap, connections) {
        if (module.resources) {
            module.resources.forEach(resource => {
                const sourceNode = nodeMap.get(resource.address);
                if (!sourceNode) return;

                // Extract references from resource expressions
                if (resource.expressions) {
                    Object.entries(resource.expressions).forEach(([key, expression]) => {
                        this.extractFromExpression(expression, key, sourceNode, nodeMap, connections);
                    });
                }

                // Extract from depends_on if available
                if (resource.depends_on) {
                    resource.depends_on.forEach(dependency => {
                        const targetNode = nodeMap.get(dependency);
                        if (targetNode && targetNode.id !== sourceNode.id) {
                            connections.push({
                                source: targetNode,
                                target: sourceNode,
                                type: 'explicit_dependency',
                                color: '#ef4444',
                                markerType: 'arrow-dependency',
                                property: 'depends_on'
                            });
                        }
                    });
                }
            });
        }

        // Process child modules recursively
        if (module.child_modules) {
            module.child_modules.forEach(childModule => {
                this.extractConfigurationConnections(childModule, nodeMap, connections);
            });
        }
    }

    extractFromExpression(expression, propertyName, sourceNode, nodeMap, connections) {
        if (!expression) return;

        // Handle direct references array
        if (expression.references && Array.isArray(expression.references)) {
            expression.references.forEach(ref => {
                const targetAddress = this.convertReferenceToAddress(ref);
                const targetNode = nodeMap.get(targetAddress);
                
                if (targetNode && targetNode.id !== sourceNode.id) {
                    connections.push({
                        source: targetNode,
                        target: sourceNode,
                        type: 'dependency',
                        color: '#f59e0b',
                        markerType: 'arrow-dependency',
                        property: propertyName
                    });
                }
            });
        }

        // Handle constant values that might contain references
        if (expression.constant_value) {
            this.searchForReferences(expression.constant_value, propertyName, sourceNode, nodeMap, connections);
        }

        // Recursively handle nested expressions
        if (typeof expression === 'object') {
            Object.entries(expression).forEach(([key, value]) => {
                if (key !== 'references' && key !== 'constant_value') {
                    this.extractFromExpression(value, `${propertyName}.${key}`, sourceNode, nodeMap, connections);
                }
            });
        }
    }

    extractPlannedValueConnections(module, nodeMap, connections) {
        if (module.resources) {
            module.resources.forEach(resource => {
                const sourceNode = nodeMap.get(resource.address);
                if (!sourceNode) return;

                // Look for references in planned values
                const values = resource.values || {};
                this.extractConfigurationReferences(values, sourceNode, nodeMap, connections);
            });
        }

        // Process child modules recursively
        if (module.child_modules) {
            module.child_modules.forEach(childModule => {
                this.extractPlannedValueConnections(childModule, nodeMap, connections);
            });
        }
    }

    findResourceReferences(value) {
        if (typeof value !== 'string') return [];
        
        const references = [];
        
        // Enhanced patterns to match various Terraform reference formats
        const patterns = [
            // Standard resource references: aws_vpc.main, aws_subnet.private[0]
            /([a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*(?:\[[^\]]+\])?)/g,
            
            // Module references: module.vpc.vpc_id
            /(module\.[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*)/g,
            
            // Data source references: data.aws_availability_zones.available
            /(data\.[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*)/g,
            
            // Variable references: var.vpc_cidr
            /(var\.[a-zA-Z_][a-zA-Z0-9_]*)/g,
            
            // Local references: local.common_tags
            /(local\.[a-zA-Z_][a-zA-Z0-9_]*)/g
        ];

        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(value)) !== null) {
                const ref = match[1];
                const address = this.convertReferenceToAddress(ref);
                if (address && !references.includes(address)) {
                    references.push(address);
                }
            }
        });
        
        return references;
    }

    convertReferenceToAddress(reference) {
        // Handle different reference types
        if (reference.startsWith('var.') || reference.startsWith('local.')) {
            // Variables and locals don't create resource connections
            return null;
        }
        
        if (reference.startsWith('data.')) {
            // Convert data.aws_availability_zones.available to data.aws_availability_zones.available
            return reference;
        }
        
        if (reference.startsWith('module.')) {
            // Module references might need special handling
            return reference;
        }
        
        // Standard resource references are already in correct format
        return reference;
    }

    extractUnknownReferences(afterUnknown, sourceNode, nodeMap, connections) {
        // Handle cases where values are unknown but we can infer dependencies
        Object.entries(afterUnknown).forEach(([key, value]) => {
            if (value === true) {
                // This property will be computed, might indicate a dependency
                // This is a simplified approach - in practice, you'd need more sophisticated logic
            }
        });
    }

    addConnectionLegend(labelGroup) {
        const legendData = [
            { color: '#38bdf8', label: 'Direct Reference', y: 50 },
            { color: '#f59e0b', label: 'Dependency', y: 70 },
            { color: '#8b5cf6', label: 'Configuration Reference', y: 90 },
            { color: '#ef4444', label: 'Explicit Dependency', y: 110 }
        ];

        const legend = labelGroup.append('g').attr('class', 'connection-legend');
        
        legend.append('text')
            .attr('x', this.width - 200)
            .attr('y', 30)
            .attr('fill', '#64748b')
            .attr('font-size', '12px')
            .attr('font-weight', '600')
            .text('Connection Types:');

        legendData.forEach(item => {
            const legendItem = legend.append('g');
            
            legendItem.append('line')
                .attr('x1', this.width - 200)
                .attr('y1', item.y)
                .attr('x2', this.width - 180)
                .attr('y2', item.y)
                .attr('stroke', item.color)
                .attr('stroke-width', 2);
                
            legendItem.append('text')
                .attr('x', this.width - 175)
                .attr('y', item.y + 4)
                .attr('fill', '#94a3b8')
                .attr('font-size', '10px')
                .text(item.label);
        });
    }
    drawConnection(source, target, linkGroup, positions, drawnLinks, color = '#38bdf8', markerType = 'arrow') {
        const linkKey = `${source.id}-${target.id}`;
        const reverseLinkKey = `${target.id}-${source.id}`;
        
        if (drawnLinks.has(linkKey) || drawnLinks.has(reverseLinkKey)) return;
        drawnLinks.add(linkKey);

        const sourcePos = positions[source.id];
        const targetPos = positions[target.id];
        
        if (!sourcePos || !targetPos) return;

        // Calculate connection points
        const sourceY = sourcePos.y + 35;
        const targetY = targetPos.y - 35;
        const midY = (sourceY + targetY) / 2;
        
        // Smart curve calculation based on distance and direction
        const distance = Math.abs(targetPos.y - sourcePos.y);
        const horizontalOffset = Math.min(50, distance * 0.3);
        
        // Determine curve direction based on relative positions
        const sourceX = sourcePos.x;
        const targetX = targetPos.x;
        const controlOffset = sourceX < targetX ? horizontalOffset : -horizontalOffset;

        // Create smooth bezier curve
        const path = linkGroup.append('path')
            .attr('d', `M ${sourceX} ${sourceY} 
                       C ${sourceX + controlOffset} ${sourceY + distance * 0.3}, 
                         ${targetX - controlOffset} ${targetY - distance * 0.3}, 
                         ${targetX} ${targetY}`)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.7)
            .style('marker-end', `url(#${markerType})`)
            .attr('class', 'connection-line');

        // Add hover effects for connections
        path.on('mouseover', function() {
            d3.select(this)
                .attr('stroke-width', 3)
                .attr('stroke-opacity', 1);
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('stroke-width', 2)
                .attr('stroke-opacity', 0.7);
        });
    }

    drawCleanNodes(nodes, positions) {
        const nodeGroup = this.svg.append('g').attr('class', 'nodes');

        nodes.forEach(node => {
            const pos = positions[node.id];
            if (!pos) return;

            const g = nodeGroup.append('g')
                .attr('class', 'node-group')
                .attr('transform', `translate(${pos.x}, ${pos.y})`)
                .style('cursor', 'pointer')
                .datum(node); // Attach node data

            // Main card
            g.append('rect')
                .attr('x', -90)
                .attr('y', -35)
                .attr('width', 180)
                .attr('height', 70)
                .attr('rx', 8)
                .attr('fill', this.getNodeColor(node.action))
                .attr('stroke', this.getNodeBorderColor(node.action))
                .attr('stroke-width', 2);

            // Service type indicator (text instead of icon)
            g.append('rect')
                .attr('x', -85)
                .attr('y', -30)
                .attr('width', 60)
                .attr('height', 20)
                .attr('rx', 4)
                .attr('fill', 'rgba(255,255,255,0.15)');

            g.append('text')
                .attr('x', -55)
                .attr('y', -16)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px')
                .attr('font-weight', '600')
                .attr('fill', '#ffffff')
                .text(this.getServiceConfig(node.type)?.provider?.toUpperCase() || 'CLOUD');

            // Service name
            g.append('text')
                .attr('x', -80)
                .attr('y', 5)
                .attr('font-size', '13px')
                .attr('font-weight', '600')
                .attr('fill', '#ffffff')
                .text(this.getServiceName(node.type));

            // Resource name
            g.append('text')
                .attr('x', -80)
                .attr('y', 22)
                .attr('font-size', '11px')
                .attr('fill', 'rgba(255,255,255,0.7)')
                .text(node.name.length > 20 ? node.name.substring(0, 20) + '...' : node.name);

            // Action badge
            const badgeColor = this.getBadgeColor(node.action);
            g.append('rect')
                .attr('x', 50)
                .attr('y', -35)
                .attr('width', 40)
                .attr('height', 18)
                .attr('rx', 4)
                .attr('fill', badgeColor);

            g.append('text')
                .attr('x', 70)
                .attr('y', -22)
                .attr('text-anchor', 'middle')
                .attr('font-size', '9px')
                .attr('font-weight', 'bold')
                .attr('fill', '#ffffff')
                .text(node.action.toUpperCase().substring(0, 3));

            // Store position for tooltip
            node.x = pos.x;
            node.y = pos.y;
        });
    }

    getNodeColor(action) {
        return this.actionStyles[action]?.node || this.actionStyles['no-op'].node;
    }

    getNodeBorderColor(action) {
        return this.actionStyles[action]?.border || this.actionStyles['no-op'].border;
    }

    getBadgeColor(action) {
        return this.actionStyles[action]?.badge || this.actionStyles['no-op'].badge;
    }

    getServiceConfig(type) {
        return this.serviceConfig[type] || { name: this.formatGenericName(type), provider: 'unknown' };
    }

    getServiceName(type) {
        return this.serviceConfig[type]?.name || this.formatGenericName(type);
    }

    formatGenericName(type) {
        // Convert aws_service_name to readable format
        return type
            .replace(/^(aws_|azurerm_|google_|digitalocean_|kubernetes_)/, '') // Remove provider prefix
            .replace(/_/g, ' ')             // Replace underscores with spaces
            .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word
    }

    prepareNodes() {
        if (!this.data.resource_changes) return [];

        // Cache nodes to avoid recalculating
        if (this.cachedNodes) return this.cachedNodes;

        this.cachedNodes = this.data.resource_changes.map((resource, index) => {
            const actions = resource.change?.actions || ['no-op'];
            const primaryAction = this.getPrimaryAction(actions);
            
            return {
                id: resource.address || `resource_${index}`,
                type: resource.type || 'unknown',
                name: resource.name || 'unnamed',
                action: primaryAction,
                color: this.actionStyles[primaryAction]?.primary || this.actionStyles['no-op'].primary,
                resource: resource
            };
        });

        return this.cachedNodes;
    }

    prepareLinks(nodes) {
        // Simplified - we now handle connections in drawLayerConnections
        return [];
    }
    // Enhanced tooltip and detail panel methods
    setupEnhancedTooltip() {
        const tooltip = d3.select('#tooltip');
        let tooltipTimeout;
        let isTooltipVisible = false;

        this.svg.selectAll('.node-group')
            .on('mouseover', (event, nodeData) => {
                if (!nodeData) return;

                // Clear any existing timeout
                if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = null;
                }

                isTooltipVisible = true;

                // Highlight connections for this node
                this.highlightNodeConnections(nodeData);

                // Get connection information
                const connectionInfo = this.getNodeConnections(nodeData);

                // Get mouse position relative to the visualization container
                const svgRect = this.svg.node().getBoundingClientRect();
                const containerRect = document.getElementById('visualization').getBoundingClientRect();
                
                // Calculate position relative to the viewport
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                
                // Calculate tooltip position with boundary checking
                let tooltipX = mouseX + 15;
                let tooltipY = mouseY - 10;
                
                // Ensure tooltip doesn't go off-screen
                const tooltipWidth = 200; // Reduced width
                const tooltipHeight = 80; // Reduced height
                
                if (tooltipX + tooltipWidth > window.innerWidth) {
                    tooltipX = mouseX - tooltipWidth - 15;
                }
                
                if (tooltipY + tooltipHeight > window.innerHeight) {
                    tooltipY = mouseY - tooltipHeight + 10;
                }
                
                if (tooltipY < 0) {
                    tooltipY = mouseY + 20;
                }

                // Enhanced hover tooltip - smaller and more compact
                tooltip.style('display', 'block')
                    .style('pointer-events', 'auto')
                    .style('position', 'fixed')
                    .style('z-index', '9999')
                    .html(`
                        <div style="border-left: 2px solid ${nodeData.color}; padding-left: 8px;">
                            <div style="font-weight: 600; font-size: 12px; margin-bottom: 2px;">${this.getServiceName(nodeData.type)}</div>
                            <div style="color: #94a3b8; font-size: 10px; margin-bottom: 2px;">${nodeData.name}</div>
                            <div style="color: ${nodeData.color}; font-weight: 500; font-size: 10px;">${nodeData.action.toUpperCase()}</div>
                        </div>
                    `)
                    .style('left', tooltipX + 'px')
                    .style('top', tooltipY + 'px');

                // Scale up node
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('transform', `translate(${nodeData.x}, ${nodeData.y}) scale(1.05)`);
            })
            .on('mousemove', (event) => {
                if (isTooltipVisible) {
                    // Get updated mouse position using fixed positioning
                    const mouseX = event.clientX;
                    const mouseY = event.clientY;
                    
                    // Calculate tooltip position with boundary checking
                    let tooltipX = mouseX + 15;
                    let tooltipY = mouseY - 10;
                    
                    // Ensure tooltip doesn't go off-screen
                    const tooltipWidth = 200;
                    const tooltipHeight = 80;
                    
                    if (tooltipX + tooltipWidth > window.innerWidth) {
                        tooltipX = mouseX - tooltipWidth - 15;
                    }
                    
                    if (tooltipY + tooltipHeight > window.innerHeight) {
                        tooltipY = mouseY - tooltipHeight + 10;
                    }
                    
                    if (tooltipY < 0) {
                        tooltipY = mouseY + 20;
                    }
                    
                    // Update tooltip position on mouse move
                    tooltip
                        .style('left', tooltipX + 'px')
                        .style('top', tooltipY + 'px');
                }
            })
            .on('mouseleave', (event, nodeData) => {
                // Only start hide timer if mouse actually leaves the node area
                tooltipTimeout = setTimeout(() => {
                    if (isTooltipVisible) {
                        isTooltipVisible = false;
                        this.resetConnectionHighlights();

                        tooltip.style('display', 'none')
                               .style('pointer-events', 'none');

                        if (nodeData) {
                            d3.select(event.currentTarget)
                                .transition()
                                .duration(200)
                                .attr('transform', `translate(${nodeData.x}, ${nodeData.y}) scale(1)`);
                        }
                    }
                }, 500); // Increased delay to 500ms for easier clicking
            })
            .on('click', (event, nodeData) => {
                if (!nodeData) return;
                
                // Clear tooltip immediately on click
                if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = null;
                }
                
                isTooltipVisible = false;
                tooltip.style('display', 'none')
                       .style('pointer-events', 'none');
                
                // Reset connections opacity
                this.resetConnectionHighlights();
                
                // Reset node scale
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('transform', `translate(${nodeData.x}, ${nodeData.y}) scale(1)`);
                
                this.showEnhancedDetailPanel(nodeData);
                event.stopPropagation();
            });

        // Handle tooltip hover to keep it visible
        tooltip.on('mouseenter', () => {
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = null;
            }
            isTooltipVisible = true;
        })
        .on('mouseleave', () => {
            // Hide tooltip when mouse leaves tooltip area
            tooltipTimeout = setTimeout(() => {
                if (isTooltipVisible) {
                    isTooltipVisible = false;
                    tooltip.style('display', 'none')
                           .style('pointer-events', 'none');
                    this.resetConnectionHighlights();
                    
                    // Reset any scaled nodes
                    this.svg.selectAll('.node-group')
                        .transition()
                        .duration(200)
                        .attr('transform', d => `translate(${d.x}, ${d.y}) scale(1)`);
                }
            }, 200);
        })
        .on('click', (event) => {
            // Allow clicking on tooltip itself to trigger node click
            event.stopPropagation();
        });
    }

    getNodeConnections(nodeData) {
        // Get actual connections from the extracted plan data
        const connections = this.extractConnectionsFromPlan();
        const nodeConnections = [];
        
        // Find connections where this node is involved
        const incomingConnections = connections.filter(conn => conn.target.id === nodeData.id);
        const outgoingConnections = connections.filter(conn => conn.source.id === nodeData.id);
        
        // Format incoming connections
        if (incomingConnections.length > 0) {
            const sources = incomingConnections.map(conn => {
                const sourceName = this.getServiceName(conn.source.type);
                const property = conn.property ? ` (${conn.property})` : '';
                return `${sourceName}${property}`;
            });
            nodeConnections.push(`← ${sources.join(', ')}`);
        }
        
        // Format outgoing connections
        if (outgoingConnections.length > 0) {
            const targets = outgoingConnections.map(conn => {
                const targetName = this.getServiceName(conn.target.type);
                const property = conn.property ? ` (${conn.property})` : '';
                return `${targetName}${property}`;
            });
            nodeConnections.push(`→ ${targets.join(', ')}`);
        }

        if (nodeConnections.length === 0) {
            return null;
        }

        return nodeConnections.map(conn => 
            `<div style="color: #94a3b8; font-size: 10px; margin: 1px 0;">${conn}</div>`
        ).join('');
    }

    highlightNodeConnections(nodeData) {
        // Get actual connections for this node
        const connections = this.extractConnectionsFromPlan();
        const relatedConnections = connections.filter(conn => 
            conn.source.id === nodeData.id || conn.target.id === nodeData.id
        );

        // Dim all connections first
        this.svg.selectAll('.connection-line')
            .style('opacity', 0.2)
            .style('stroke-width', 1);

        // Highlight related connections
        // Note: This is a simplified approach. In a real implementation, 
        // you'd need to track which SVG elements correspond to which connections
        if (relatedConnections.length > 0) {
            // For now, highlight a few random connections as a demo
            // In practice, you'd store connection metadata with the SVG elements
            this.svg.selectAll('.connection-line')
                .filter((d, i) => i < relatedConnections.length)
                .style('opacity', 1)
                .style('stroke-width', 3);
        }
    }

    resetConnectionHighlights() {
        this.svg.selectAll('.connection-line')
            .style('opacity', 0.7)
            .style('stroke-width', 2);
    }
    showEnhancedDetailPanel(nodeData) {
        // Remove existing panel if any
        const existingPanel = document.getElementById('detail-panel');
        if (existingPanel) existingPanel.remove();

        const resource = nodeData.resource || {};
        const change = resource.change || {};
        const before = change.before || {};
        const after = change.after || {};
        
        // Build variables/attributes list with enhanced formatting
        const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
        let variablesHtml = '';
        
        allKeys.forEach(key => {
            // Filter out noisy fields
            if (key === 'id' || key === 'arn' || key.startsWith('tags_all') || key === 'owner_id') return;
            
            const beforeVal = before[key];
            const afterVal = after[key];
            
            // Skip complex objects and nulls for cleaner display
            if (typeof afterVal === 'object' && afterVal !== null && !Array.isArray(afterVal)) return;
            if (afterVal === null && beforeVal === null) return;
            
            const displayVal = afterVal !== undefined ? this.formatValue(afterVal) : this.formatValue(beforeVal);
            const changed = JSON.stringify(beforeVal) !== JSON.stringify(afterVal) && beforeVal !== undefined;
            
            variablesHtml += `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #94a3b8; font-size: 12px; font-weight: 500;">${this.formatKeyName(key)}</span>
                    <span style="color: ${changed ? '#fbbf24' : '#e2e8f0'}; font-size: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right;" title="${displayVal}">
                        ${changed ? '⚡ ' : ''}${displayVal}
                    </span>
                </div>
            `;
        });

        // Build tags section with enhanced styling
        let tagsHtml = '';
        const tags = after.tags || before.tags || {};
        if (Object.keys(tags).length > 0) {
            tagsHtml = `
                <div style="margin-top: 20px;">
                    <div style="font-weight: 600; font-size: 12px; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Tags</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${Object.entries(tags).map(([k, v]) => `
                            <div style="display: inline-flex; align-items: center; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 4px 8px; border-radius: 6px; font-size: 11px;">
                                <span style="color: #60a5fa; font-weight: 500;">${k}</span>
                                <span style="color: #94a3b8; margin: 0 4px;">:</span>
                                <span style="color: #e2e8f0;">${v}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Create enhanced detail panel on the RIGHT side (no icons)
        const panel = document.createElement('div');
        panel.id = 'detail-panel';
        panel.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            width: 420px !important;
            height: 100vh !important;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98)) !important;
            border-left: 1px solid rgba(148, 163, 184, 0.2) !important;
            padding: 0 !important;
            overflow: hidden !important;
            z-index: 10000 !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3) !important;
            transform: translateX(100%) !important;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        `;
        
        panel.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <!-- Header -->
                <div style="padding: 24px; border-bottom: 1px solid rgba(148, 163, 184, 0.1); background: rgba(0, 0, 0, 0.1); flex-shrink: 0;">
                    <button onclick="document.getElementById('detail-panel').remove()" style="position: absolute; top: 20px; right: 20px; background: rgba(239, 68, 68, 0.2); border: none; color: #f87171; width: 36px; height: 36px; border-radius: 8px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">×</button>
                    
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.1); border-radius: 12px; font-size: 12px; font-weight: 600; color: #ffffff; text-align: center;">${this.getServiceConfig(nodeData.type)?.provider?.toUpperCase() || 'CLOUD'}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 700; font-size: 20px; color: #f1f5f9; margin-bottom: 4px;">${this.getServiceName(nodeData.type)}</div>
                            <div style="color: #94a3b8; font-size: 14px;">${nodeData.name}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 8px;">
                        <span style="background: ${nodeData.color}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${nodeData.action}</span>
                        <span style="background: rgba(100, 116, 139, 0.3); color: #94a3b8; padding: 6px 12px; border-radius: 6px; font-size: 12px;">${nodeData.type}</span>
                    </div>
                </div>
                
                <!-- Scrollable Content -->
                <div style="padding: 24px; flex: 1; overflow-y: auto;">
                    
                    <!-- Resource Address -->
                    <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid rgba(148, 163, 184, 0.1);">
                        <div style="font-weight: 600; font-size: 12px; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Resource Address</div>
                        <code style="color: #60a5fa; font-size: 13px; word-break: break-all; line-height: 1.4;">${nodeData.id}</code>
                    </div>
                    
                    <!-- Configuration Variables -->
                    <div style="margin-bottom: 20px;">
                        <div style="font-weight: 600; font-size: 12px; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Configuration</div>
                        <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 12px; border: 1px solid rgba(148, 163, 184, 0.05); max-height: 300px; overflow-y: auto;">
                            ${variablesHtml || '<div style="color: #64748b; font-size: 12px; text-align: center; padding: 20px;">No configuration details available</div>'}
                        </div>
                    </div>
                    
                    ${tagsHtml}
                    
                    <!-- Change Summary -->
                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-weight: 600; font-size: 12px; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Change Summary</div>
                        <div style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
                            ${change.before ? '• Resource has existing state' : '• New resource will be created'}<br>
                            ${change.after ? '• Will have new configuration applied' : '• Resource will be removed'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Force a reflow to ensure the initial transform is applied
        panel.offsetHeight;
        
        // Add slide-in animation from RIGHT side
        setTimeout(() => {
            panel.style.transform = 'translateX(0)';
        }, 10);
    }

    formatValue(val) {
        if (val === null || val === undefined) return 'null';
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        if (Array.isArray(val)) return val.length > 0 ? `[${val.length} items]` : '[]';
        if (typeof val === 'object') return '{...}';
        return String(val);
    }

    formatKeyName(key) {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    generateTerraformDocs() {
        if (!this.data.resource_changes) return '';

        const nodes = this.prepareNodes();
        const docsGenerator = new TerraformDocsGenerator();
        return docsGenerator.generateTerraformDocs(this.data, nodes);
    }
}

// Global functions
function exportDiagram(format) {
    if (!visualizer.svg) return;
    
    const svgElement = visualizer.svg.node();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    
    if (format === 'svg') {
        // Export as SVG
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'terraform-architecture.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else if (format === 'png') {
        // Export as PNG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        canvas.width = visualizer.width;
        canvas.height = visualizer.height;
        
        // Set background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'terraform-architecture.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        };
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        img.src = svgUrl;
    }
}

function generateTerraformDocs() {
    if (visualizer.data) {
        // Ask user for filename
        const fileName = prompt('Enter filename for documentation (without .md extension):', 'infrastructure-documentation');
        if (!fileName) return; // User cancelled
        
        const documentation = visualizer.generateTerraformDocs();
        const blob = new Blob([documentation], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        alert(`Documentation ${fileName}.md generated and downloaded successfully!`);
    }
}

function resetVisualization() {
    // Clear all data and cached elements
    visualizer.data = null;
    visualizer.cachedNodes = null;
    visualizer.svg = null;
    
    // Remove any existing detail panels
    const existingPanel = document.getElementById('detail-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Clear visualization container completely
    const visualizationContainer = document.getElementById('visualization');
    if (visualizationContainer) {
        visualizationContainer.innerHTML = '';
    }
    
    // Clear stats panel
    const statsPanel = document.getElementById('stats-panel');
    if (statsPanel) {
        statsPanel.innerHTML = '';
    }
    
    // Clear legend
    const legend = document.getElementById('legend');
    if (legend) {
        legend.innerHTML = '';
    }
    
    // Hide tooltip if visible
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
    
    // Reset UI state
    document.getElementById('visualization-container').style.display = 'none';
    document.getElementById('drop-zone').style.display = 'block';
    document.getElementById('file-input').value = '';
    
    // Clear any console logs for clean start
    console.clear();
    console.log('Visualization reset - ready for new Terraform plan');
}

// Initialize the visualizer
const visualizer = new TerraformVisualizer();