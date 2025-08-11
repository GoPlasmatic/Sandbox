#!/usr/bin/env python3
import json
import os
import sys

def format_display_name(name):
    """Convert scenario name to human-readable display name"""
    # Convert to title case and replace underscores
    human_name = name.replace('_', ' ').title()
    
    # Fix common abbreviations and acronyms
    replacements = {
        'Cbpr': 'CBPR+',
        'Mt': 'MT',
        'Stp': 'STP',
        'Fx': 'FX',
        'Fi ': 'FI ',
        'B2c': 'B2C',
        'B2b': 'B2B',
        'Saas': 'SaaS',
        'Lei': 'LEI',
        'Uetr': 'UETR',
        'Cov ': 'COV ',
        'Iso': 'ISO',
        'Xml': 'XML',
        'Api': 'API',
        'Kyc': 'KYC',
        'Aml': 'AML',
    }
    
    for old, new in replacements.items():
        human_name = human_name.replace(old, new)
    
    return human_name

def generate_swift_mt_data():
    """Generate Swift MT message data for components"""
    base_path = '/Users/codetiger/Development/Plasmatic/SwiftMTMessage/test_scenarios'
    os.chdir(base_path)
    
    # Simple structure for dropdown components
    dropdown_data = {
        'messageTypes': [],
        'scenariosByType': {}
    }
    
    # Full inventory for reference
    full_inventory = {
        'swift_mt_messages': {
            'description': 'Swift MT Message Test Scenarios Inventory',
            'total_message_types': 0,
            'total_scenarios': 0,
            'message_types': {}
        }
    }
    
    # Get all MT directories
    mt_dirs = sorted([d for d in os.listdir('.') if d.startswith('mt') and os.path.isdir(d)])
    
    for mt_dir in mt_dirs:
        mt_type = mt_dir.upper()
        
        # Get all scenario files (excluding index.json)
        scenario_files = sorted([f for f in os.listdir(mt_dir) if f.endswith('.json') and f != 'index.json'])
        
        # Read index.json for description if exists
        description = ''
        index_path = os.path.join(mt_dir, 'index.json')
        if os.path.exists(index_path):
            with open(index_path, 'r') as f:
                index_data = json.load(f)
                description = index_data.get('description', '')
        
        # Add to dropdown data
        dropdown_data['messageTypes'].append({
            'value': mt_type,
            'label': mt_type,
            'description': description
        })
        
        # Get scenario details for dropdown
        dropdown_scenarios = []
        full_scenarios = []
        
        for scenario_file in scenario_files:
            scenario_name = scenario_file.replace('.json', '')
            display_name = format_display_name(scenario_name)
            
            # Simple format for dropdown
            dropdown_scenarios.append({
                'value': scenario_name,
                'label': display_name
            })
            
            # Full format for inventory
            full_scenarios.append({
                'file': scenario_file,
                'name': scenario_name,
                'display_name': display_name
            })
        
        dropdown_data['scenariosByType'][mt_type] = dropdown_scenarios
        
        # Add to full inventory
        full_inventory['swift_mt_messages']['message_types'][mt_type] = {
            'description': description,
            'scenario_count': len(full_scenarios),
            'scenarios': full_scenarios
        }
    
    # Calculate totals
    full_inventory['swift_mt_messages']['total_message_types'] = len(mt_dirs)
    full_inventory['swift_mt_messages']['total_scenarios'] = sum(
        mt['scenario_count'] for mt in full_inventory['swift_mt_messages']['message_types'].values()
    )
    dropdown_data['totalTypes'] = len(mt_dirs)
    dropdown_data['totalScenarios'] = full_inventory['swift_mt_messages']['total_scenarios']
    
    return dropdown_data, full_inventory

def generate_mx_data():
    """Generate ISO 20022 MX message data for components"""
    base_path = '/Users/codetiger/Development/Plasmatic/MXMessage/test_scenarios'
    os.chdir(base_path)
    
    # Simple structure for dropdown components
    dropdown_data = {
        'messageTypes': [],
        'scenariosByType': {}
    }
    
    # Full inventory for reference
    full_inventory = {
        'iso20022_mx_messages': {
            'description': 'ISO 20022 MX Message Test Scenarios Inventory',
            'total_message_types': 0,
            'total_scenarios': 0,
            'message_types': {}
        }
    }
    
    # Get all relevant directories
    mx_dirs = sorted([d for d in os.listdir('.') 
                     if (d.startswith('camt') or d.startswith('pacs') or d.startswith('pain')) 
                     and os.path.isdir(d)])
    
    for mx_dir in mx_dirs:
        # Convert directory name to message type format (e.g., camt025 -> camt.025)
        if mx_dir.startswith('camt'):
            mx_type = 'camt.' + mx_dir[4:]
        elif mx_dir.startswith('pacs'):
            mx_type = 'pacs.' + mx_dir[4:]
        elif mx_dir.startswith('pain'):
            mx_type = 'pain.' + mx_dir[4:]
        else:
            mx_type = mx_dir
        
        # Get all scenario files (excluding index.json)
        scenario_files = sorted([f for f in os.listdir(mx_dir) if f.endswith('.json') and f != 'index.json'])
        
        # Read index.json for description if exists
        description = ''
        index_path = os.path.join(mx_dir, 'index.json')
        if os.path.exists(index_path):
            with open(index_path, 'r') as f:
                index_data = json.load(f)
                description = index_data.get('description', '')
        
        # Add to dropdown data
        dropdown_data['messageTypes'].append({
            'value': mx_type,
            'label': mx_type,
            'description': description
        })
        
        # Get scenario details for dropdown
        dropdown_scenarios = []
        full_scenarios = []
        
        for scenario_file in scenario_files:
            scenario_name = scenario_file.replace('.json', '')
            display_name = format_display_name(scenario_name)
            
            # Simple format for dropdown
            dropdown_scenarios.append({
                'value': scenario_name,
                'label': display_name
            })
            
            # Full format for inventory
            full_scenarios.append({
                'file': scenario_file,
                'name': scenario_name,
                'display_name': display_name
            })
        
        dropdown_data['scenariosByType'][mx_type] = dropdown_scenarios
        
        # Add to full inventory
        full_inventory['iso20022_mx_messages']['message_types'][mx_type] = {
            'description': description,
            'scenario_count': len(full_scenarios),
            'scenarios': full_scenarios
        }
    
    # Calculate totals
    full_inventory['iso20022_mx_messages']['total_message_types'] = len(mx_dirs)
    full_inventory['iso20022_mx_messages']['total_scenarios'] = sum(
        mx['scenario_count'] for mx in full_inventory['iso20022_mx_messages']['message_types'].values()
    )
    dropdown_data['totalTypes'] = len(mx_dirs)
    dropdown_data['totalScenarios'] = full_inventory['iso20022_mx_messages']['total_scenarios']
    
    return dropdown_data, full_inventory

def generate_summary():
    """Generate a summary file with statistics"""
    swift_dropdown, swift_full = generate_swift_mt_data()
    mx_dropdown, mx_full = generate_mx_data()
    
    summary = {
        'generated_at': __import__('datetime').datetime.now().isoformat(),
        'statistics': {
            'total_message_types': swift_dropdown['totalTypes'] + mx_dropdown['totalTypes'],
            'total_scenarios': swift_dropdown['totalScenarios'] + mx_dropdown['totalScenarios'],
            'swift_mt': {
                'message_types': swift_dropdown['totalTypes'],
                'scenarios': swift_dropdown['totalScenarios']
            },
            'iso20022_mx': {
                'message_types': mx_dropdown['totalTypes'],
                'scenarios': mx_dropdown['totalScenarios']
            }
        },
        'message_types': {
            'swift_mt': list(swift_full['swift_mt_messages']['message_types'].keys()),
            'iso20022_mx': list(mx_full['iso20022_mx_messages']['message_types'].keys())
        }
    }
    
    return summary

if __name__ == "__main__":
    # Output directory
    output_dir = '/Users/codetiger/Development/Plasmatic/Sandbox/website/static/data'
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate Swift MT data
    print("Generating Swift MT data...")
    swift_dropdown, swift_full = generate_swift_mt_data()
    
    # Save Swift MT dropdown data (optimized for components)
    with open(os.path.join(output_dir, 'swift_mt_dropdown.json'), 'w') as f:
        json.dump(swift_dropdown, f, indent=2)
    
    # Save Swift MT full inventory (for reference)
    with open(os.path.join(output_dir, 'swift_mt_inventory.json'), 'w') as f:
        json.dump(swift_full, f, indent=2)
    
    # Generate ISO 20022 MX data
    print("Generating ISO 20022 MX data...")
    mx_dropdown, mx_full = generate_mx_data()
    
    # Save MX dropdown data (optimized for components)
    with open(os.path.join(output_dir, 'mx_dropdown.json'), 'w') as f:
        json.dump(mx_dropdown, f, indent=2)
    
    # Save MX full inventory (for reference)
    with open(os.path.join(output_dir, 'mx_inventory.json'), 'w') as f:
        json.dump(mx_full, f, indent=2)
    
    # Generate and save summary
    print("Generating summary...")
    summary = generate_summary()
    with open(os.path.join(output_dir, 'message_summary.json'), 'w') as f:
        json.dump(summary, f, indent=2)
    
    
    print("\n✅ Files generated successfully!")
    print(f"\n📁 Component-optimized files in: {output_dir}")
    print(f"  - swift_mt_dropdown.json (Swift MT dropdown data)")
    print(f"  - mx_dropdown.json (ISO 20022 dropdown data)")
    print(f"  - swift_mt_inventory.json (Full Swift MT inventory)")
    print(f"  - mx_inventory.json (Full ISO 20022 inventory)")
    print(f"  - message_summary.json (Statistics and summary)")
    
    print(f"\n📊 Statistics:")
    print(f"  Swift MT: {swift_dropdown['totalTypes']} types, {swift_dropdown['totalScenarios']} scenarios")
    print(f"  ISO 20022 MX: {mx_dropdown['totalTypes']} types, {mx_dropdown['totalScenarios']} scenarios")
    print(f"  Total: {summary['statistics']['total_message_types']} types, {summary['statistics']['total_scenarios']} scenarios")