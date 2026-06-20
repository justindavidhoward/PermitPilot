export interface PermitRequirement {
  name: string;
  description: string;
  forms_needed: string[];
  fees: number;
  estimated_timeline: string;
  required_inspections: string[];
  issuing_department: string;
}

export interface ProjectDetails {
  project_type: string;
  location_city: string;
  location_state: string;
  project_scope: string;
  size?: string;
  estimated_cost?: number;
  property_details?: string;
}

export async function determinePermits(details: ProjectDetails): Promise<PermitRequirement[]> {
  console.log('Determining permits for details:', JSON.stringify(details));
  const permits: PermitRequirement[] = [];
  const state = details.location_state.toUpperCase();
  console.log('Detected state:', state);
  const type = details.project_type.toLowerCase();
  
  // Base Rule-based engine with state variations
  if (type.includes('deck')) {
    let fee = 150;
    let timeline = '5-10 business days';
    let forms = ['Building Permit Application', 'Site Plan', 'Framing Plan'];
    let dept = 'Building Department';

    if (state === 'CA') {
      fee = 250;
      timeline = '15-20 business days';
      forms.push('Wildfire Resilient Construction Plan');
    } else if (state === 'TX') {
      fee = 100;
      timeline = '3-5 business days';
    }

    permits.push({
      name: 'Residential Building Permit (Deck)',
      description: 'Required for any deck higher than 30 inches above grade or attached to the house.',
      forms_needed: forms,
      fees: fee + (details.estimated_cost ? details.estimated_cost * 0.01 : 0),
      estimated_timeline: timeline,
      required_inspections: ['Footing', 'Framing', 'Final'],
      issuing_department: dept
    });
  } else if (type.includes('garage')) {
    let fee = 300;
    let timeline = '10-20 business days';
    let forms = ['Building Permit Application', 'Site Plan', 'Foundation Plan', 'Structural Drawings'];
    let dept = 'Building Safety Division';

    if (state === 'CA') {
      fee = 500;
      timeline = '30-45 business days';
      forms.push('CalGreen Checklist', 'Title 24 Energy Documentation');
    } else if (state === 'WA') {
      fee = 400;
      timeline = '20-30 business days';
      forms.push('WA State Energy Code Form');
    }

    permits.push({
      name: 'Residential Building Permit (Garage)',
      description: 'Required for detached or attached garages.',
      forms_needed: forms,
      fees: fee + (details.estimated_cost ? details.estimated_cost * 0.015 : 0),
      estimated_timeline: timeline,
      required_inspections: ['Footing', 'Slab', 'Framing', 'Electrical Rough-in', 'Final'],
      issuing_department: dept
    });

    permits.push({
      name: 'Electrical Permit',
      description: 'Required for new electrical circuits in the garage.',
      forms_needed: ['Electrical Permit Application'],
      fees: state === 'CA' ? 150 : 75,
      estimated_timeline: state === 'TX' ? '2 business days' : '3-5 business days',
      required_inspections: ['Rough-in', 'Final'],
      issuing_department: 'Electrical Division'
    });
  } else if (type.includes('pool')) {
    let fee = 250;
    let timeline = '7-14 business days';
    let forms = ['Building Permit Application', 'Site Plan', 'Pool Safety Agreement', 'Electrical Application'];
    let dept = 'Planning and Building';

    if (state === 'CA') {
      fee = 450;
      timeline = '20-30 business days';
      forms.push('Water Conservation Calculation');
    }

    permits.push({
      name: 'Swimming Pool Permit',
      description: 'Required for all in-ground pools and above-ground pools deeper than 24 inches.',
      forms_needed: forms,
      fees: fee,
      estimated_timeline: timeline,
      required_inspections: ['Stake-out', 'Bonding/Grounding', 'Plumbing Pressure Test', 'Fence/Safety', 'Final'],
      issuing_department: dept
    });
  } else if (type.includes('roof')) {
    permits.push({
      name: 'Roofing Permit',
      description: 'Required for complete roof replacement.',
      forms_needed: ['Building Permit Application'],
      fees: state === 'CA' ? 200 : 100,
      estimated_timeline: state === 'TX' ? '1 business day' : '1-3 business days',
      required_inspections: ['Mid-roof (Ice & Water)', 'Final'],
      issuing_department: 'Building Department'
    });
  } else if (type.includes('renovation') || type.includes('remodel')) {
    let fee = 200;
    let timeline = '10-15 business days';
    let forms = ['Building Permit Application', 'Existing/Proposed Floor Plans'];
    let dept = 'Permit Center';

    if (state === 'CA') {
      fee = 400;
      timeline = '25-35 business days';
      forms.push('CalGreen Checklist', 'Title 24 Energy Documentation');
    } else if (state === 'WA') {
      fee = 300;
      timeline = '15-25 business days';
    }

    permits.push({
      name: 'Interior Alteration Permit',
      description: 'Required for structural changes, moving walls, or plumbing/electrical updates.',
      forms_needed: forms,
      fees: fee + (details.estimated_cost ? details.estimated_cost * 0.012 : 0),
      estimated_timeline: timeline,
      required_inspections: ['Framing', 'Electrical Rough-in', 'Plumbing Rough-in', 'Mechanical Rough-in', 'Insulation', 'Final'],
      issuing_department: dept
    });
  } else if (type.includes('workshop') || type.includes('shed')) {
    permits.push({
      name: 'Accessory Structure Permit',
      description: 'Required for sheds or workshops over 200 sq ft.',
      forms_needed: ['Building Permit Application', 'Site Plan'],
      fees: 120,
      estimated_timeline: state === 'TX' ? '3 business days' : '5-7 business days',
      required_inspections: ['Footing', 'Final'],
      issuing_department: 'Building Department'
    });
  } else if (type.includes('commercial')) {
    let fee = 500;
    let timeline = '20-30 business days';
    let forms = ['Commercial Building Permit Application', 'Architectural Plans', 'Fire Safety Plan'];
    let dept = 'Development Services';

    if (state === 'CA') {
      fee = 1000;
      timeline = '60-90 business days';
      forms.push('Environmental Health Review', 'Sewer Capacity Study');
    }

    permits.push({
      name: 'Commercial Build-out Permit',
      description: 'Required for interior renovations of commercial spaces.',
      forms_needed: forms,
      fees: fee + (details.estimated_cost ? details.estimated_cost * 0.02 : 0),
      estimated_timeline: timeline,
      required_inspections: ['Fire Marshal', 'ADA Compliance', 'Structural', 'Electrical Rough-in', 'Plumbing Rough-in', 'Final'],
      issuing_department: dept
    });
  }

  // LLM Augmentation Fallback / Enhancement
  if (permits.length === 0 || details.project_scope.length > 100) {
    if (permits.length === 0) {
      permits.push({
        name: 'General Construction Permit',
        description: `Based on your scope: "${details.project_scope}", a general permit is likely required. Consult your local building department for specific requirements in ${details.location_city}, ${details.location_state}.`,
        forms_needed: ['Building Permit Application', 'Project Description'],
        fees: state === 'CA' ? 200 : 100,
        estimated_timeline: state === 'CA' ? '15-20 business days' : '5-15 business days',
        required_inspections: ['Varies based on scope', 'Final'],
        issuing_department: 'Building Department'
      });
    }
  }

  return permits;
}
