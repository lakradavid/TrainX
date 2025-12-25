import React, { useState, useEffect } from 'react';

const NutritionRecommendations = ({ currentGoal, currentWeight, targetWeight, trainingIntensity, sessions }) => {
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    generateNutritionRecommendations();
  }, [currentGoal, currentWeight, targetWeight, trainingIntensity, sessions]);

  const generateNutritionRecommendations = () => {
    if (!currentWeight) {
      setRecommendations(null);
      return;
    }

    const weight = parseFloat(currentWeight);
    const target = targetWeight ? parseFloat(targetWeight) : weight;
    
    // Base metabolic calculations
    const bmr = 88.362 + (13.397 * weight) + (4.799 * 175) - (5.677 * 30); // Assuming average height and age
    
    // Activity multipliers based on training intensity and frequency
    const activityMultipliers = {
      rest: 1.2,
      light: 1.375,
      moderate: 1.55,
      normal: 1.725,
      high: 1.9
    };
    
    const activityLevel = activityMultipliers[trainingIntensity] || 1.55;
    const tdee = bmr * activityLevel;
    
    // Goal-specific calorie adjustments
    let calorieTarget = tdee;
    let proteinTarget = 1.6; // g/kg
    let carbTarget = 4; // g/kg
    let fatTarget = 1; // g/kg
    
    switch (currentGoal) {
      case 'weight_loss':
        calorieTarget = tdee - 500; // 500 calorie deficit
        proteinTarget = 2.0; // Higher protein for muscle preservation
        carbTarget = 3;
        fatTarget = 0.8;
        break;
      case 'muscle':
        calorieTarget = tdee + 300; // 300 calorie surplus
        proteinTarget = 2.2; // Higher protein for muscle building
        carbTarget = 5;
        fatTarget = 1.2;
        break;
      case 'strength':
        calorieTarget = tdee + 200; // Slight surplus
        proteinTarget = 2.0;
        carbTarget = 4.5;
        fatTarget = 1.1;
        break;
      case 'endurance':
        calorieTarget = tdee + 100;
        proteinTarget = 1.8;
        carbTarget = 6; // Higher carbs for endurance
        fatTarget = 1.0;
        break;
      default:
        calorieTarget = tdee;
        break;
    }
    
    // Calculate macros in grams
    const proteinGrams = proteinTarget * weight;
    const carbGrams = carbTarget * weight;
    const fatGrams = fatTarget * weight;
    
    // Calculate calories from macros
    const proteinCalories = proteinGrams * 4;
    const carbCalories = carbGrams * 4;
    const fatCalories = fatGrams * 9;
    
    // Meal timing recommendations
    const mealTiming = {
      'weight_loss': {
        meals: 4,
        preworkout: 'Light snack 30-60 min before',
        postworkout: 'Protein within 30 min',
        tips: ['Eat protein with every meal', 'Focus on vegetables', 'Limit processed foods']
      },
      'muscle': {
        meals: 5,
        preworkout: 'Carbs + protein 1-2 hours before',
        postworkout: 'Protein + carbs within 30 min',
        tips: ['Eat every 3-4 hours', 'Include protein at every meal', 'Don\'t skip meals']
      },
      'strength': {
        meals: 4,
        preworkout: 'Balanced meal 2-3 hours before',
        postworkout: 'Protein + carbs within 1 hour',
        tips: ['Focus on whole foods', 'Adequate carbs for energy', 'Consistent meal timing']
      },
      'endurance': {
        meals: 5,
        preworkout: 'Carb-rich meal 2-3 hours before',
        postworkout: 'Carbs + protein within 30 min',
        tips: ['Emphasize complex carbs', 'Stay hydrated', 'Consider electrolyte replacement']
      }
    };
    
    // Hydration recommendations
    const baseWater = 35 * weight; // ml per kg
    const exerciseWater = sessions * 500; // extra ml per session
    const totalWater = (baseWater + exerciseWater) / 1000; // convert to liters
    
    // Supplement recommendations
    const supplements = {
      'weight_loss': ['Whey Protein', 'Multivitamin', 'Omega-3'],
      'muscle': ['Whey Protein', 'Creatine', 'Multivitamin', 'Omega-3'],
      'strength': ['Whey Protein', 'Creatine', 'Multivitamin'],
      'endurance': ['Whey Protein', 'Electrolytes', 'Multivitamin', 'Beta-Alanine']
    };
    
    setRecommendations({
      calories: Math.round(calorieTarget),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
      proteinCalories: Math.round(proteinCalories),
      carbCalories: Math.round(carbCalories),
      fatCalories: Math.round(fatCalories),
      water: totalWater.toFixed(1),
      mealTiming: mealTiming[currentGoal] || mealTiming['strength'],
      supplements: supplements[currentGoal] || supplements['strength'],
      bmr: Math.round(bmr),
      tdee: Math.round(tdee)
    });
  };

  if (!recommendations) {
    return (
      <div className="text-center text-muted">
        <p>Enter your current weight to get personalized nutrition recommendations.</p>
      </div>
    );
  }

  return (
    <div className="nutrition-recommendations">
      <h5 className="fw-bold mb-3">🍎 Personalized Nutrition Plan</h5>
      
      {/* Calorie Overview */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{recommendations.calories}</h4>
              <small>Daily Calories</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{recommendations.protein}g</h4>
              <small>Protein ({Math.round((recommendations.proteinCalories / recommendations.calories) * 100)}%)</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body text-center">
              <h4>{recommendations.carbs}g</h4>
              <small>Carbs ({Math.round((recommendations.carbCalories / recommendations.calories) * 100)}%)</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{recommendations.fat}g</h4>
              <small>Fat ({Math.round((recommendations.fatCalories / recommendations.calories) * 100)}%)</small>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">📊 Metabolic Information</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Basal Metabolic Rate (BMR):</span>
                <strong>{recommendations.bmr} calories</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Daily Energy Expenditure:</span>
                <strong>{recommendations.tdee} calories</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Daily Water Intake:</span>
                <strong>{recommendations.water}L</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Goal:</span>
                <strong className="text-capitalize">{currentGoal.replace('_', ' ')}</strong>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">⏰ Meal Timing</h6>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Recommended Meals:</strong> {recommendations.mealTiming.meals} per day
              </div>
              <div className="mb-2">
                <strong>Pre-Workout:</strong> {recommendations.mealTiming.preworkout}
              </div>
              <div className="mb-2">
                <strong>Post-Workout:</strong> {recommendations.mealTiming.postworkout}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips and Supplements */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">💡 Nutrition Tips</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                {recommendations.mealTiming.tips.map((tip, index) => (
                  <li key={index} className="mb-2">
                    <span className="badge bg-primary me-2">{index + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">💊 Recommended Supplements</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {recommendations.supplements.map((supplement, index) => (
                  <span key={index} className="badge bg-secondary p-2">
                    {supplement}
                  </span>
                ))}
              </div>
              <small className="text-muted mt-2 d-block">
                Consult with a healthcare provider before starting any supplements.
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Meal Plan */}
      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">🍽️ Sample Daily Meal Distribution</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <strong>Breakfast (25%)</strong>
              <br />
              <small>
                {Math.round(recommendations.calories * 0.25)} cal<br />
                P: {Math.round(recommendations.protein * 0.25)}g<br />
                C: {Math.round(recommendations.carbs * 0.25)}g<br />
                F: {Math.round(recommendations.fat * 0.25)}g
              </small>
            </div>
            <div className="col-md-3">
              <strong>Lunch (30%)</strong>
              <br />
              <small>
                {Math.round(recommendations.calories * 0.30)} cal<br />
                P: {Math.round(recommendations.protein * 0.30)}g<br />
                C: {Math.round(recommendations.carbs * 0.30)}g<br />
                F: {Math.round(recommendations.fat * 0.30)}g
              </small>
            </div>
            <div className="col-md-3">
              <strong>Dinner (30%)</strong>
              <br />
              <small>
                {Math.round(recommendations.calories * 0.30)} cal<br />
                P: {Math.round(recommendations.protein * 0.30)}g<br />
                C: {Math.round(recommendations.carbs * 0.30)}g<br />
                F: {Math.round(recommendations.fat * 0.30)}g
              </small>
            </div>
            <div className="col-md-3">
              <strong>Snacks (15%)</strong>
              <br />
              <small>
                {Math.round(recommendations.calories * 0.15)} cal<br />
                P: {Math.round(recommendations.protein * 0.15)}g<br />
                C: {Math.round(recommendations.carbs * 0.15)}g<br />
                F: {Math.round(recommendations.fat * 0.15)}g
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionRecommendations;