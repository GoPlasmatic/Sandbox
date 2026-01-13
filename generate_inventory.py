#!/usr/bin/env python3
"""
Generate scenario dropdown data from reframe-package-swift-cbpr.

Reads the package's index.json and individual scenario files to generate
dropdown data for the documentation playground.
"""
import json
import os
from pathlib import Path

# Paths (relative to this script's location)
SCRIPT_DIR = Path(__file__).parent.resolve()
PACKAGE_PATH = SCRIPT_DIR.parent / "reframe-package-swift-cbpr" / "scenarios"
OUTPUT_DIR = SCRIPT_DIR / "docs" / "src" / "data"


def load_scenario_details(scenario_file: Path) -> dict:
    """Load additional details from individual scenario file."""
    try:
        with open(scenario_file, 'r') as f:
            data = json.load(f)
            return {
                'variant': data.get('variant', ''),
                'full_description': data.get('description', '')
            }
    except Exception:
        return {}


def generate_dropdown_data() -> dict:
    """Generate dropdown data from package index.json."""
    index_file = PACKAGE_PATH / "index.json"

    if not index_file.exists():
        print(f"Error: Package index not found: {index_file}")
        return {
            'transformationTypes': [],
            'scenariosByType': {},
            'totalTypes': 0,
            'totalScenarios': 0
        }

    with open(index_file, 'r') as f:
        index_data = json.load(f)

    dropdown_data = {
        'transformationTypes': [],
        'scenariosByType': {}
    }

    # Process outgoing (MT to MX) -> forward
    if 'outgoing' in index_data:
        dropdown_data['transformationTypes'].append({
            'value': 'forward',
            'label': 'Forward (MT to MX)',
            'description': 'Swift MT to ISO 20022 MX transformations'
        })

        forward_scenarios = []
        for scenario in index_data['outgoing']:
            # Load additional details from scenario file
            scenario_file = PACKAGE_PATH / scenario['file']
            details = load_scenario_details(scenario_file)

            forward_scenarios.append({
                'value': scenario['id'],
                'label': f"{scenario['source']}: {scenario['description']}",
                'source': scenario['source'],
                'target': scenario['target'],
                'variant': details.get('variant', ''),
                'file': scenario['file']
            })

        dropdown_data['scenariosByType']['forward'] = forward_scenarios

    # Process incoming (MX to MT) -> reverse
    if 'incoming' in index_data:
        dropdown_data['transformationTypes'].append({
            'value': 'reverse',
            'label': 'Reverse (MX to MT)',
            'description': 'ISO 20022 MX to Swift MT transformations'
        })

        reverse_scenarios = []
        for scenario in index_data['incoming']:
            # Load additional details from scenario file
            scenario_file = PACKAGE_PATH / scenario['file']
            details = load_scenario_details(scenario_file)

            reverse_scenarios.append({
                'value': scenario['id'],
                'label': f"{scenario['source']}: {scenario['description']}",
                'source': scenario['source'],
                'target': scenario['target'],
                'variant': details.get('variant', ''),
                'file': scenario['file']
            })

        dropdown_data['scenariosByType']['reverse'] = reverse_scenarios

    # Calculate totals
    dropdown_data['totalTypes'] = len(dropdown_data['transformationTypes'])
    dropdown_data['totalScenarios'] = sum(
        len(scenarios) for scenarios in dropdown_data['scenariosByType'].values()
    )

    return dropdown_data


def main():
    print(f"Package path: {PACKAGE_PATH}")
    print(f"Output directory: {OUTPUT_DIR}")

    # Ensure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Generate dropdown data
    print("\nGenerating dropdown data...")
    dropdown_data = generate_dropdown_data()

    # Save to file
    output_file = OUTPUT_DIR / "reframe_dropdown.json"
    with open(output_file, 'w') as f:
        json.dump(dropdown_data, f, indent=2)

    print(f"\nGenerated: {output_file}")
    print(f"  Types: {dropdown_data['totalTypes']}")
    print(f"  Scenarios: {dropdown_data['totalScenarios']}")

    # Print breakdown
    for type_name, scenarios in dropdown_data['scenariosByType'].items():
        print(f"    {type_name}: {len(scenarios)} scenarios")


if __name__ == "__main__":
    main()
