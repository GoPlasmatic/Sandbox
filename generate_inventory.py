#!/usr/bin/env python3
import json
import os
import sys
import shutil

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
        'Pacs': 'pacs',
        'Pain': 'pain',
        'Camt': 'camt',
        'Admi': 'admi',
        'Rejt': 'REJT',
        'Retn': 'RETN',
        'Adv': 'ADV',
        'Mtn': 'MTn',
    }
    
    for old, new in replacements.items():
        human_name = human_name.replace(old, new)
    
    return human_name

def generate_reframe_transformation_data():
    """Generate Reframe transformation scenarios data from index.json"""
    base_path = '/Users/codetiger/Development/Plasmatic/reframe-package-swift-cbpr/scenarios'
    index_file = os.path.join(base_path, 'index.json')
    
    # Simple structure for dropdown components
    dropdown_data = {
        'transformationTypes': [],
        'scenariosByType': {}
    }
    
    # Full inventory for reference
    full_inventory = {
        'reframe_transformations': {
            'description': 'Reframe Transformation Scenarios Inventory',
            'total_transformation_types': 0,
            'total_scenarios': 0,
            'transformation_types': {}
        }
    }
    
    # Check if the index file exists
    if not os.path.exists(index_file):
        print(f"Warning: Reframe scenarios index not found: {index_file}")
        dropdown_data['totalTypes'] = 0
        dropdown_data['totalScenarios'] = 0
        return dropdown_data, full_inventory
    
    try:
        # Load the index.json file
        with open(index_file, 'r') as f:
            index_data = json.load(f)
        
        # Process forward transformations (outgoing: MT to MX)
        if 'outgoing' in index_data:
            dropdown_data['transformationTypes'].append({
                'value': 'forward',
                'label': 'Forward (MT to MX)',
                'description': 'Swift MT to ISO 20022 MX transformations'
            })

            forward_dropdown = []
            forward_full = []

            for scenario in index_data['outgoing']:
                # Create a simplified label without target format
                display_label = f"{scenario['source']}: {scenario['description']}"

                forward_dropdown.append({
                    'value': scenario['id'],
                    'label': display_label,
                    'source': scenario['source'],
                    'target': scenario['target']
                })

                forward_full.append({
                    'id': scenario['id'],
                    'file': scenario['file'],
                    'source': scenario['source'],
                    'target': scenario['target'],
                    'description': scenario['description'],
                    'display_name': display_label
                })

            dropdown_data['scenariosByType']['forward'] = forward_dropdown
            full_inventory['reframe_transformations']['transformation_types']['forward'] = {
                'description': 'Swift MT to ISO 20022 MX transformations',
                'scenario_count': len(forward_full),
                'scenarios': forward_full
            }
        
        # Process reverse transformations (incoming: MX to MT)
        if 'incoming' in index_data:
            dropdown_data['transformationTypes'].append({
                'value': 'reverse',
                'label': 'Reverse (MX to MT)',
                'description': 'ISO 20022 MX to Swift MT transformations'
            })

            reverse_dropdown = []
            reverse_full = []

            for scenario in index_data['incoming']:
                # Create a simplified label without target format
                display_label = f"{scenario['source']}: {scenario['description']}"

                reverse_dropdown.append({
                    'value': scenario['id'],
                    'label': display_label,
                    'source': scenario['source'],
                    'target': scenario['target']
                })

                reverse_full.append({
                    'id': scenario['id'],
                    'file': scenario['file'],
                    'source': scenario['source'],
                    'target': scenario['target'],
                    'description': scenario['description'],
                    'display_name': display_label
                })

            dropdown_data['scenariosByType']['reverse'] = reverse_dropdown
            full_inventory['reframe_transformations']['transformation_types']['reverse'] = {
                'description': 'ISO 20022 MX to Swift MT transformations',
                'scenario_count': len(reverse_full),
                'scenarios': reverse_full
            }
        
        # Calculate totals
        full_inventory['reframe_transformations']['total_transformation_types'] = len(dropdown_data['transformationTypes'])
        full_inventory['reframe_transformations']['total_scenarios'] = sum(
            tt['scenario_count'] for tt in full_inventory['reframe_transformations']['transformation_types'].values()
        )
        dropdown_data['totalTypes'] = len(dropdown_data['transformationTypes'])
        dropdown_data['totalScenarios'] = full_inventory['reframe_transformations']['total_scenarios']
        
    except Exception as e:
        print(f"Error reading index file: {e}")
        dropdown_data['totalTypes'] = 0
        dropdown_data['totalScenarios'] = 0
    
    return dropdown_data, full_inventory

def generate_summary():
    """Generate a summary file with statistics"""
    reframe_dropdown, reframe_full = generate_reframe_transformation_data()
    
    summary = {
        'generated_at': __import__('datetime').datetime.now().isoformat(),
        'statistics': {
            'total_transformation_types': reframe_dropdown['totalTypes'],
            'total_scenarios': reframe_dropdown['totalScenarios'],
            'reframe_transformations': {
                'transformation_types': reframe_dropdown['totalTypes'],
                'scenarios': reframe_dropdown['totalScenarios']
            }
        },
        'transformation_types': list(reframe_full['reframe_transformations']['transformation_types'].keys())
    }
    
    return summary

if __name__ == "__main__":
    # Output directory
    output_dir = '/Users/codetiger/Development/Plasmatic/Sandbox/website/static/data'
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    print("Generating Reframe transformation data...")
    reframe_dropdown, reframe_full = generate_reframe_transformation_data()
    
    # Save Reframe dropdown data (optimized for components)
    with open(os.path.join(output_dir, 'reframe_dropdown.json'), 'w') as f:
        json.dump(reframe_dropdown, f, indent=2)
    
    # Save Reframe full inventory (for reference)
    with open(os.path.join(output_dir, 'reframe_inventory.json'), 'w') as f:
        json.dump(reframe_full, f, indent=2)
    
    # Generate and save summary
    print("Generating summary...")
    summary = generate_summary()
    with open(os.path.join(output_dir, 'message_summary.json'), 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("\n✅ Files generated successfully!")
    print(f"\n📁 Files generated in: {output_dir}")
    print(f"  - reframe_dropdown.json (Reframe transformation dropdown data)")
    print(f"  - reframe_inventory.json (Full Reframe transformation inventory)")
    print(f"  - message_summary.json (Statistics and summary)")
    
    print(f"\n📊 Statistics:")
    print(f"  Reframe Transformations: {reframe_dropdown['totalTypes']} types, {reframe_dropdown['totalScenarios']} scenarios")
    
    # Cleanup: Remove old unused files from previous versions
    print("\n🧹 Cleaning up old unused files...")
    old_files = [
        'swift_mt_dropdown.json',
        'swift_mt_inventory.json', 
        'mx_dropdown.json',
        'mx_inventory.json'
    ]
    
    cleanup_count = 0
    for old_file in old_files:
        file_path = os.path.join(output_dir, old_file)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"  ✓ Removed {old_file}")
                cleanup_count += 1
            except Exception as e:
                print(f"  ⚠️  Error removing {old_file}: {e}")
    
    # Also check for and remove reframe_scenarios directory if it exists
    reframe_scenarios_dir = os.path.join(output_dir, 'reframe_scenarios')
    if os.path.exists(reframe_scenarios_dir):
        try:
            shutil.rmtree(reframe_scenarios_dir)
            print(f"  ✓ Removed reframe_scenarios directory")
            cleanup_count += 1
        except Exception as e:
            print(f"  ⚠️  Error removing reframe_scenarios directory: {e}")
    
    if cleanup_count > 0:
        print(f"  🗑️  Total files/directories cleaned up: {cleanup_count}")
    else:
        print(f"  ℹ️  No old files to clean up")
    
    print("\n✨ Inventory generation complete!")