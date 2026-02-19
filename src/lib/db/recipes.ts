export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisineCountry: string;
  mealType: ("breakfast" | "lunch" | "dinner" | "snack")[];
  prepTimeMinutes: number;
  servings: number;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  nutrients: { calories: number; protein: number; carbohydrates: number; fat: number; fiber?: number };
  tags: string[];
  dietCompatibility: string[];
}

export const RECIPES: Recipe[] = [
  // ============ MEXICO ============
  { id: "chilaquiles-verdes", name: "Chilaquiles Verdes", description: "Crispy tortilla chips bathed in tangy green salsa with chicken", cuisineCountry: "mexico", mealType: ["breakfast"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Corn tortillas", amount: "8 pieces" }, { name: "Tomatillo salsa verde", amount: "1.5 cups" }, { name: "Shredded chicken breast", amount: "150g" }, { name: "Queso fresco", amount: "50g" }],
    instructions: ["Cut tortillas into triangles and fry until crispy", "Heat salsa verde in a pan, add tortilla chips", "Top with shredded chicken and crumbled queso fresco", "Serve with sour cream and avocado"],
    nutrients: { calories: 420, protein: 28, carbohydrates: 38, fat: 18, fiber: 5 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "chicken-tacos", name: "Chicken Tacos", description: "Seasoned grilled chicken in warm corn tortillas with fresh salsa", cuisineCountry: "mexico", mealType: ["lunch", "dinner"], prepTimeMinutes: 20, servings: 2,
    ingredients: [{ name: "Chicken breast", amount: "300g" }, { name: "Corn tortillas", amount: "6 small" }, { name: "Lime", amount: "2" }, { name: "Cilantro and onion", amount: "1/2 cup each" }],
    instructions: ["Season chicken with cumin, chili powder, salt and grill", "Warm tortillas on a dry skillet", "Slice chicken and place on tortillas", "Top with diced onion, cilantro, and lime juice"],
    nutrients: { calories: 450, protein: 42, carbohydrates: 35, fat: 14, fiber: 4 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "mediterranean"] },
  { id: "enchiladas-rojas", name: "Enchiladas Rojas", description: "Rolled tortillas filled with chicken in rich red chile sauce", cuisineCountry: "mexico", mealType: ["dinner"], prepTimeMinutes: 40, servings: 3,
    ingredients: [{ name: "Corn tortillas", amount: "12" }, { name: "Chicken breast", amount: "400g" }, { name: "Dried guajillo chiles", amount: "6" }, { name: "Mexican cheese blend", amount: "100g" }],
    instructions: ["Boil and shred chicken", "Toast and blend chiles with garlic for sauce", "Dip tortillas in sauce, fill with chicken, roll", "Place in baking dish, cover with sauce and cheese, bake 20min"],
    nutrients: { calories: 520, protein: 38, carbohydrates: 42, fat: 20, fiber: 6 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "nopales-salad", name: "Nopales Salad", description: "Fresh cactus paddle salad with tomatoes, onion, and queso fresco", cuisineCountry: "mexico", mealType: ["snack", "lunch"], prepTimeMinutes: 15, servings: 2,
    ingredients: [{ name: "Nopales (cactus paddles)", amount: "300g" }, { name: "Tomato", amount: "2 medium" }, { name: "White onion", amount: "1/2" }, { name: "Queso fresco", amount: "50g" }],
    instructions: ["Clean and dice nopales, boil 10 min, drain", "Dice tomatoes and onion", "Mix nopales with vegetables, lime juice, cilantro", "Top with crumbled queso fresco"],
    nutrients: { calories: 150, protein: 8, carbohydrates: 15, fat: 7, fiber: 6 }, tags: ["low-carb", "vegetarian", "gluten-free", "quick"], dietCompatibility: ["balanced", "keto", "mediterranean"] },

  // ============ COLOMBIA ============
  { id: "arepa-con-huevo", name: "Arepa con Huevo", description: "Corn arepa topped with a fried egg and hogao sauce", cuisineCountry: "colombia", mealType: ["breakfast"], prepTimeMinutes: 15, servings: 1,
    ingredients: [{ name: "Pre-cooked corn flour", amount: "80g" }, { name: "Egg", amount: "1 large" }, { name: "Butter", amount: "10g" }, { name: "Hogao (tomato-onion sauce)", amount: "3 tbsp" }],
    instructions: ["Mix corn flour with water and salt, form flat disc", "Cook arepa on griddle 4 min per side", "Fry egg sunny-side up", "Serve arepa topped with egg and hogao"],
    nutrients: { calories: 380, protein: 14, carbohydrates: 42, fat: 17, fiber: 3 }, tags: ["vegetarian", "gluten-free"], dietCompatibility: ["balanced"] },
  { id: "bandeja-paisa", name: "Bandeja Paisa (Light)", description: "Lighter version of the classic Colombian platter with beans, rice, and grilled steak", cuisineCountry: "colombia", mealType: ["lunch"], prepTimeMinutes: 35, servings: 2,
    ingredients: [{ name: "Flank steak", amount: "250g" }, { name: "Red beans", amount: "1 cup cooked" }, { name: "White rice", amount: "1 cup cooked" }, { name: "Plantain", amount: "1 medium" }],
    instructions: ["Season and grill steak to desired doneness", "Heat beans with cumin and garlic", "Cook rice, slice and pan-fry plantain", "Plate all components together"],
    nutrients: { calories: 650, protein: 40, carbohydrates: 65, fat: 22, fiber: 8 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "ajiaco", name: "Ajiaco", description: "Hearty Bogotá-style chicken and potato soup with corn", cuisineCountry: "colombia", mealType: ["dinner"], prepTimeMinutes: 50, servings: 4,
    ingredients: [{ name: "Chicken thighs", amount: "500g" }, { name: "Mixed potatoes", amount: "400g" }, { name: "Corn on the cob", amount: "2" }, { name: "Guascas herb", amount: "2 tbsp" }],
    instructions: ["Boil chicken in large pot with potatoes and corn", "Simmer until potatoes dissolve and broth thickens", "Shred chicken, return to pot, add guascas", "Serve with capers, cream, and avocado"],
    nutrients: { calories: 380, protein: 32, carbohydrates: 35, fat: 12, fiber: 5 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "empanadas-colombianas", name: "Empanadas Colombianas", description: "Crispy corn empanadas filled with seasoned beef and potato", cuisineCountry: "colombia", mealType: ["snack"], prepTimeMinutes: 40, servings: 4,
    ingredients: [{ name: "Pre-cooked corn flour", amount: "200g" }, { name: "Ground beef", amount: "200g" }, { name: "Potato", amount: "1 large" }, { name: "Cumin and achiote", amount: "1 tsp each" }],
    instructions: ["Cook ground beef with potato, cumin and seasoning", "Make dough with corn flour and water", "Fill dough rounds with meat mixture, fold and seal", "Deep fry until golden"],
    nutrients: { calories: 280, protein: 15, carbohydrates: 28, fat: 12, fiber: 2 }, tags: ["gluten-free"], dietCompatibility: ["balanced"] },

  // ============ ARGENTINA ============
  { id: "milanesa-de-pollo", name: "Milanesa de Pollo", description: "Breaded chicken cutlet, Argentine style, baked for a lighter version", cuisineCountry: "argentina", mealType: ["dinner", "lunch"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Chicken breast", amount: "300g" }, { name: "Breadcrumbs", amount: "1 cup" }, { name: "Eggs", amount: "2" }, { name: "Lemon", amount: "1" }],
    instructions: ["Pound chicken thin, season with salt, oregano, garlic", "Dip in beaten egg, then coat in breadcrumbs", "Bake at 200C for 20 min, flipping halfway", "Serve with lemon wedges and salad"],
    nutrients: { calories: 420, protein: 40, carbohydrates: 25, fat: 16, fiber: 1 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "empanadas-argentinas", name: "Empanadas Argentinas", description: "Baked pastry pockets filled with seasoned beef, olives, and egg", cuisineCountry: "argentina", mealType: ["lunch", "snack"], prepTimeMinutes: 45, servings: 6,
    ingredients: [{ name: "Empanada dough", amount: "12 discs" }, { name: "Ground beef", amount: "300g" }, { name: "Onion", amount: "2 large" }, { name: "Green olives and hard-boiled egg", amount: "1/2 cup each" }],
    instructions: ["Cook beef with onion, cumin, paprika and pepper", "Add chopped olives and diced egg", "Fill dough discs, fold and crimp edges", "Bake at 200C for 20 min until golden"],
    nutrients: { calories: 320, protein: 18, carbohydrates: 28, fat: 15, fiber: 1 }, tags: [], dietCompatibility: ["balanced"] },
  { id: "provoleta", name: "Provoleta", description: "Grilled provolone cheese with oregano and chili flakes", cuisineCountry: "argentina", mealType: ["snack"], prepTimeMinutes: 10, servings: 2,
    ingredients: [{ name: "Provolone cheese", amount: "200g" }, { name: "Oregano", amount: "1 tsp" }, { name: "Chili flakes", amount: "1/2 tsp" }, { name: "Olive oil", amount: "1 tbsp" }],
    instructions: ["Slice cheese into thick round", "Place on hot grill or cast iron skillet", "Cook until melted and golden on bottom", "Top with oregano, chili flakes and olive oil drizzle"],
    nutrients: { calories: 280, protein: 18, carbohydrates: 2, fat: 22, fiber: 0 }, tags: ["low-carb", "vegetarian", "quick", "gluten-free"], dietCompatibility: ["keto", "balanced"] },

  // ============ PERU ============
  { id: "ceviche", name: "Ceviche", description: "Fresh white fish cured in lime juice with red onion and aji", cuisineCountry: "peru", mealType: ["lunch"], prepTimeMinutes: 20, servings: 2,
    ingredients: [{ name: "White fish (sea bass)", amount: "300g" }, { name: "Lime juice", amount: "1 cup" }, { name: "Red onion", amount: "1" }, { name: "Aji amarillo", amount: "1" }],
    instructions: ["Cube fish and marinate in lime juice 15 min", "Slice red onion thinly, rinse in cold water", "Mix fish with onion, aji, cilantro, salt", "Serve with sweet potato and corn"],
    nutrients: { calories: 250, protein: 35, carbohydrates: 12, fat: 6, fiber: 2 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "mediterranean", "keto"] },
  { id: "lomo-saltado", name: "Lomo Saltado", description: "Peruvian stir-fried beef with tomatoes, onions, and fries over rice", cuisineCountry: "peru", mealType: ["dinner"], prepTimeMinutes: 30, servings: 2,
    ingredients: [{ name: "Beef sirloin", amount: "300g" }, { name: "Tomatoes", amount: "2 medium" }, { name: "Red onion", amount: "1 large" }, { name: "French fries and rice", amount: "1 cup each" }],
    instructions: ["Cut beef into strips, sear on high heat", "Stir-fry onion and tomato wedges", "Add soy sauce and vinegar, combine with beef", "Serve over rice alongside fries"],
    nutrients: { calories: 580, protein: 38, carbohydrates: 48, fat: 22, fiber: 4 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "quinoa-breakfast-bowl", name: "Quinoa Breakfast Bowl", description: "Warm quinoa porridge with cinnamon, fresh fruit and nuts", cuisineCountry: "peru", mealType: ["breakfast"], prepTimeMinutes: 15, servings: 1,
    ingredients: [{ name: "Quinoa", amount: "80g dry" }, { name: "Milk", amount: "1 cup" }, { name: "Banana and berries", amount: "1/2 cup" }, { name: "Almonds", amount: "15g" }],
    instructions: ["Cook quinoa in milk with cinnamon until creamy", "Top with sliced banana and berries", "Add chopped almonds and drizzle of honey", "Serve warm"],
    nutrients: { calories: 420, protein: 16, carbohydrates: 58, fat: 14, fiber: 7 }, tags: ["vegetarian", "gluten-free"], dietCompatibility: ["balanced", "mediterranean"] },

  // ============ BRAZIL ============
  { id: "acai-bowl", name: "Açaí Bowl", description: "Thick frozen açaí blend topped with granola, banana, and honey", cuisineCountry: "brazil", mealType: ["breakfast", "snack"], prepTimeMinutes: 10, servings: 1,
    ingredients: [{ name: "Frozen açaí pulp", amount: "200g" }, { name: "Banana", amount: "1" }, { name: "Granola", amount: "30g" }, { name: "Honey", amount: "1 tbsp" }],
    instructions: ["Blend frozen açaí with half a banana until thick", "Pour into bowl", "Top with sliced banana, granola, and honey", "Add optional coconut flakes"],
    nutrients: { calories: 380, protein: 6, carbohydrates: 62, fat: 12, fiber: 8 }, tags: ["vegetarian", "quick"], dietCompatibility: ["balanced"] },
  { id: "feijoada-light", name: "Feijoada Light", description: "Lighter black bean stew with lean pork and orange slices", cuisineCountry: "brazil", mealType: ["lunch"], prepTimeMinutes: 60, servings: 4,
    ingredients: [{ name: "Black beans", amount: "400g dried" }, { name: "Lean pork loin", amount: "300g" }, { name: "Linguiça (sausage)", amount: "100g" }, { name: "Orange", amount: "2" }],
    instructions: ["Soak beans overnight, then simmer until tender", "Cube pork and sausage, brown in pot", "Add beans with broth, bay leaves, garlic", "Simmer 30min, serve with rice, collards, orange slices"],
    nutrients: { calories: 480, protein: 35, carbohydrates: 45, fat: 16, fiber: 12 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "frango-grelhado", name: "Frango Grelhado com Farofa", description: "Brazilian grilled chicken with toasted cassava flour", cuisineCountry: "brazil", mealType: ["dinner"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Chicken breast", amount: "300g" }, { name: "Farofa (cassava flour)", amount: "60g" }, { name: "Butter", amount: "15g" }, { name: "Collard greens", amount: "200g" }],
    instructions: ["Marinate chicken in lime, garlic, and herbs", "Grill chicken until cooked through", "Toast farofa in butter with onion", "Sauté collard greens, serve together"],
    nutrients: { calories: 440, protein: 42, carbohydrates: 28, fat: 16, fiber: 4 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },

  // ============ USA ============
  { id: "overnight-oats", name: "Overnight Oats", description: "Creamy chilled oats with protein-packed Greek yogurt and berries", cuisineCountry: "usa", mealType: ["breakfast"], prepTimeMinutes: 5, servings: 1,
    ingredients: [{ name: "Rolled oats", amount: "60g" }, { name: "Greek yogurt", amount: "100g" }, { name: "Milk", amount: "120ml" }, { name: "Mixed berries", amount: "80g" }],
    instructions: ["Mix oats, yogurt, milk, and chia seeds in jar", "Refrigerate overnight (or at least 4 hours)", "Top with fresh berries and a drizzle of honey", "Enjoy cold"],
    nutrients: { calories: 380, protein: 20, carbohydrates: 50, fat: 10, fiber: 7 }, tags: ["vegetarian", "quick", "high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "grilled-chicken-salad", name: "Grilled Chicken Salad", description: "Mixed greens with grilled chicken, avocado, and light vinaigrette", cuisineCountry: "usa", mealType: ["lunch"], prepTimeMinutes: 20, servings: 1,
    ingredients: [{ name: "Chicken breast", amount: "180g" }, { name: "Mixed greens", amount: "150g" }, { name: "Avocado", amount: "1/2" }, { name: "Cherry tomatoes", amount: "100g" }],
    instructions: ["Season and grill chicken breast", "Toss mixed greens with sliced tomatoes and cucumber", "Slice chicken and avocado on top", "Drizzle with olive oil and lemon vinaigrette"],
    nutrients: { calories: 420, protein: 40, carbohydrates: 15, fat: 22, fiber: 8 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto", "mediterranean"] },
  { id: "lean-beef-stir-fry", name: "Lean Beef Stir-Fry", description: "Quick beef and vegetable stir-fry with ginger soy sauce", cuisineCountry: "usa", mealType: ["dinner"], prepTimeMinutes: 20, servings: 2,
    ingredients: [{ name: "Lean beef strips", amount: "300g" }, { name: "Broccoli and bell pepper", amount: "300g" }, { name: "Soy sauce", amount: "3 tbsp" }, { name: "Brown rice", amount: "1 cup cooked" }],
    instructions: ["Stir-fry beef strips on high heat until browned", "Remove beef, cook vegetables until crisp-tender", "Return beef, add soy sauce, ginger, garlic", "Serve over brown rice"],
    nutrients: { calories: 480, protein: 40, carbohydrates: 35, fat: 18, fiber: 5 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "greek-yogurt-parfait", name: "Greek Yogurt Parfait", description: "Layered yogurt with granola, mixed berries and honey", cuisineCountry: "usa", mealType: ["snack", "breakfast"], prepTimeMinutes: 5, servings: 1,
    ingredients: [{ name: "Greek yogurt", amount: "200g" }, { name: "Granola", amount: "30g" }, { name: "Mixed berries", amount: "100g" }, { name: "Honey", amount: "1 tbsp" }],
    instructions: ["Layer yogurt in a glass or bowl", "Add a layer of granola", "Top with mixed berries", "Drizzle with honey"],
    nutrients: { calories: 300, protein: 22, carbohydrates: 38, fat: 6, fiber: 3 }, tags: ["vegetarian", "quick", "high-protein"], dietCompatibility: ["balanced", "high_protein"] },

  // ============ SPAIN ============
  { id: "tortilla-espanola", name: "Tortilla Española", description: "Classic Spanish potato and egg omelette", cuisineCountry: "spain", mealType: ["breakfast", "lunch"], prepTimeMinutes: 30, servings: 4,
    ingredients: [{ name: "Potatoes", amount: "400g" }, { name: "Eggs", amount: "6" }, { name: "Onion", amount: "1 large" }, { name: "Olive oil", amount: "4 tbsp" }],
    instructions: ["Thinly slice potatoes and onion, fry slowly in olive oil until tender", "Beat eggs, mix with potatoes and onion", "Cook in skillet on low until bottom sets", "Flip and cook other side until golden"],
    nutrients: { calories: 320, protein: 14, carbohydrates: 28, fat: 16, fiber: 3 }, tags: ["vegetarian", "gluten-free"], dietCompatibility: ["balanced", "mediterranean"] },
  { id: "gazpacho", name: "Gazpacho", description: "Chilled tomato soup blended with cucumber, pepper, and olive oil", cuisineCountry: "spain", mealType: ["lunch", "snack"], prepTimeMinutes: 15, servings: 3,
    ingredients: [{ name: "Ripe tomatoes", amount: "600g" }, { name: "Cucumber", amount: "1" }, { name: "Red bell pepper", amount: "1" }, { name: "Extra virgin olive oil", amount: "3 tbsp" }],
    instructions: ["Roughly chop all vegetables", "Blend with stale bread, garlic, sherry vinegar, olive oil", "Season with salt and pepper", "Chill for at least 1 hour before serving"],
    nutrients: { calories: 180, protein: 4, carbohydrates: 18, fat: 10, fiber: 4 }, tags: ["vegan", "gluten-free", "low-carb", "quick"], dietCompatibility: ["balanced", "mediterranean", "iifym"] },
  { id: "paella-mariscos", name: "Paella de Mariscos", description: "Saffron rice with shrimp, mussels, and seasonal vegetables", cuisineCountry: "spain", mealType: ["dinner"], prepTimeMinutes: 45, servings: 4,
    ingredients: [{ name: "Bomba rice", amount: "300g" }, { name: "Mixed seafood (shrimp, mussels)", amount: "400g" }, { name: "Saffron threads", amount: "1/2 tsp" }, { name: "Bell peppers and peas", amount: "200g" }],
    instructions: ["Toast rice in olive oil with garlic and paprika", "Add saffron-infused fish stock, simmer", "Arrange seafood on top, cover and cook", "Let rest 5 min for socarrat to form on bottom"],
    nutrients: { calories: 480, protein: 30, carbohydrates: 55, fat: 14, fiber: 3 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "mediterranean"] },
  { id: "pan-con-tomate", name: "Pan con Tomate", description: "Toasted bread rubbed with ripe tomato and drizzled with olive oil", cuisineCountry: "spain", mealType: ["snack", "breakfast"], prepTimeMinutes: 5, servings: 2,
    ingredients: [{ name: "Rustic bread", amount: "4 slices" }, { name: "Ripe tomatoes", amount: "2 large" }, { name: "Extra virgin olive oil", amount: "2 tbsp" }, { name: "Garlic", amount: "1 clove" }],
    instructions: ["Toast bread slices", "Cut tomatoes in half and grate on bread", "Rub with garlic", "Drizzle with olive oil and sprinkle salt"],
    nutrients: { calories: 220, protein: 5, carbohydrates: 30, fat: 9, fiber: 3 }, tags: ["vegan", "quick"], dietCompatibility: ["balanced", "mediterranean"] },

  // ============ ITALY ============
  { id: "frittata", name: "Vegetable Frittata", description: "Italian open-face omelette loaded with seasonal vegetables", cuisineCountry: "italy", mealType: ["breakfast", "lunch"], prepTimeMinutes: 20, servings: 3,
    ingredients: [{ name: "Eggs", amount: "6" }, { name: "Zucchini and bell pepper", amount: "200g" }, { name: "Parmesan cheese", amount: "40g" }, { name: "Olive oil", amount: "2 tbsp" }],
    instructions: ["Sauté diced vegetables in olive oil", "Beat eggs with parmesan, salt, pepper", "Pour over vegetables, cook on medium-low", "Finish under broiler until golden"],
    nutrients: { calories: 280, protein: 18, carbohydrates: 6, fat: 20, fiber: 2 }, tags: ["vegetarian", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "keto", "mediterranean"] },
  { id: "pasta-primavera", name: "Pasta Primavera", description: "Penne with sautéed seasonal vegetables in light garlic olive oil", cuisineCountry: "italy", mealType: ["lunch", "dinner"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Penne pasta", amount: "200g" }, { name: "Mixed vegetables", amount: "300g" }, { name: "Garlic and olive oil", amount: "3 cloves, 2 tbsp" }, { name: "Parmesan", amount: "30g" }],
    instructions: ["Cook pasta al dente", "Sauté vegetables in garlic and olive oil", "Toss pasta with vegetables", "Finish with parmesan and fresh basil"],
    nutrients: { calories: 450, protein: 16, carbohydrates: 60, fat: 14, fiber: 6 }, tags: ["vegetarian"], dietCompatibility: ["balanced", "mediterranean"] },
  { id: "chicken-caprese", name: "Grilled Chicken Caprese", description: "Grilled chicken topped with fresh mozzarella, tomato, and basil", cuisineCountry: "italy", mealType: ["dinner"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Chicken breast", amount: "300g" }, { name: "Fresh mozzarella", amount: "100g" }, { name: "Tomatoes", amount: "2 large" }, { name: "Fresh basil and balsamic", amount: "handful, 2 tbsp" }],
    instructions: ["Season and grill chicken until cooked", "Slice tomato and mozzarella", "Top chicken with tomato, mozzarella, basil", "Drizzle with balsamic reduction"],
    nutrients: { calories: 440, protein: 45, carbohydrates: 8, fat: 24, fiber: 2 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto", "mediterranean"] },
  { id: "bruschetta", name: "Bruschetta", description: "Toasted bread topped with fresh tomato, basil, and garlic", cuisineCountry: "italy", mealType: ["snack"], prepTimeMinutes: 10, servings: 2,
    ingredients: [{ name: "Italian bread", amount: "4 slices" }, { name: "Tomatoes", amount: "3" }, { name: "Fresh basil", amount: "handful" }, { name: "Garlic and olive oil", amount: "2 cloves, 2 tbsp" }],
    instructions: ["Dice tomatoes, mix with basil, garlic, olive oil", "Toast bread slices", "Rub toast with garlic", "Top with tomato mixture"],
    nutrients: { calories: 200, protein: 5, carbohydrates: 26, fat: 8, fiber: 2 }, tags: ["vegan", "quick"], dietCompatibility: ["balanced", "mediterranean"] },

  // ============ FRANCE ============
  { id: "croque-madame", name: "Croque Madame", description: "French grilled ham and cheese sandwich topped with a fried egg", cuisineCountry: "france", mealType: ["breakfast", "lunch"], prepTimeMinutes: 15, servings: 1,
    ingredients: [{ name: "Sourdough bread", amount: "2 slices" }, { name: "Ham", amount: "60g" }, { name: "Gruyère cheese", amount: "50g" }, { name: "Egg", amount: "1" }],
    instructions: ["Spread béchamel on bread, layer ham and cheese", "Grill sandwich until golden", "Fry egg sunny side up", "Place egg on top of sandwich"],
    nutrients: { calories: 480, protein: 28, carbohydrates: 32, fat: 24, fiber: 2 }, tags: [], dietCompatibility: ["balanced"] },
  { id: "nicoise-salad", name: "Salade Niçoise", description: "Classic French salad with tuna, green beans, eggs, and olives", cuisineCountry: "france", mealType: ["lunch"], prepTimeMinutes: 20, servings: 2,
    ingredients: [{ name: "Canned tuna", amount: "200g" }, { name: "Eggs", amount: "2" }, { name: "Green beans", amount: "150g" }, { name: "Olives and cherry tomatoes", amount: "1/2 cup each" }],
    instructions: ["Hard-boil eggs, blanch green beans", "Arrange lettuce, green beans, tomatoes, olives on plate", "Add flaked tuna and quartered eggs", "Dress with olive oil and Dijon vinaigrette"],
    nutrients: { calories: 380, protein: 32, carbohydrates: 12, fat: 22, fiber: 4 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "mediterranean"] },
  { id: "ratatouille", name: "Ratatouille", description: "Provençal vegetable stew with eggplant, zucchini, and tomatoes", cuisineCountry: "france", mealType: ["dinner"], prepTimeMinutes: 45, servings: 4,
    ingredients: [{ name: "Eggplant", amount: "1 large" }, { name: "Zucchini", amount: "2" }, { name: "Tomatoes", amount: "4" }, { name: "Bell peppers and olive oil", amount: "2 peppers, 3 tbsp" }],
    instructions: ["Dice all vegetables into similar-sized pieces", "Sauté each vegetable separately in olive oil", "Combine in pot with tomato sauce, herbs de Provence", "Simmer 20 min until tender"],
    nutrients: { calories: 180, protein: 4, carbohydrates: 20, fat: 10, fiber: 6 }, tags: ["vegan", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "mediterranean", "keto"] },

  // ============ GERMANY ============
  { id: "muesli-bowl", name: "Müsli Bowl", description: "Traditional German oat and nut mixture with yogurt and fresh fruit", cuisineCountry: "germany", mealType: ["breakfast"], prepTimeMinutes: 5, servings: 1,
    ingredients: [{ name: "Müsli mix", amount: "60g" }, { name: "Yogurt", amount: "150g" }, { name: "Apple", amount: "1" }, { name: "Mixed nuts", amount: "20g" }],
    instructions: ["Pour müsli into bowl", "Top with yogurt", "Dice apple and add on top", "Sprinkle with nuts"],
    nutrients: { calories: 380, protein: 14, carbohydrates: 52, fat: 12, fiber: 6 }, tags: ["vegetarian", "quick"], dietCompatibility: ["balanced"] },
  { id: "turkey-schnitzel", name: "Turkey Schnitzel", description: "Breaded and pan-fried turkey cutlet, lighter than traditional pork", cuisineCountry: "germany", mealType: ["lunch", "dinner"], prepTimeMinutes: 20, servings: 2,
    ingredients: [{ name: "Turkey breast", amount: "300g" }, { name: "Breadcrumbs", amount: "100g" }, { name: "Egg", amount: "1" }, { name: "Lemon", amount: "1" }],
    instructions: ["Pound turkey thin, season with salt and pepper", "Dip in flour, then egg, then breadcrumbs", "Pan-fry in oil until golden on both sides", "Serve with lemon wedge and potato salad"],
    nutrients: { calories: 380, protein: 38, carbohydrates: 22, fat: 14, fiber: 1 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "lentil-soup", name: "Linsensuppe", description: "Hearty German lentil soup with vegetables and smoked sausage", cuisineCountry: "germany", mealType: ["dinner"], prepTimeMinutes: 40, servings: 4,
    ingredients: [{ name: "Brown lentils", amount: "250g" }, { name: "Carrots and celery", amount: "200g" }, { name: "Smoked turkey sausage", amount: "100g" }, { name: "Onion and garlic", amount: "1 each" }],
    instructions: ["Sauté diced onion, carrots, celery", "Add lentils and broth, simmer 25 min", "Add sliced sausage", "Season with vinegar, salt, pepper"],
    nutrients: { calories: 350, protein: 25, carbohydrates: 40, fat: 8, fiber: 14 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },

  // ============ UK ============
  { id: "porridge-berries", name: "Porridge with Berries", description: "Creamy Scottish oats topped with mixed berries and seeds", cuisineCountry: "uk", mealType: ["breakfast"], prepTimeMinutes: 10, servings: 1,
    ingredients: [{ name: "Rolled oats", amount: "60g" }, { name: "Milk", amount: "200ml" }, { name: "Mixed berries", amount: "100g" }, { name: "Chia seeds", amount: "1 tbsp" }],
    instructions: ["Cook oats with milk and water until creamy", "Top with berries and chia seeds", "Add a drizzle of honey if desired", "Serve warm"],
    nutrients: { calories: 340, protein: 14, carbohydrates: 48, fat: 10, fiber: 8 }, tags: ["vegetarian"], dietCompatibility: ["balanced"] },
  { id: "cottage-pie", name: "Cottage Pie with Turkey", description: "Lean turkey mince topped with mashed potato, baked until golden", cuisineCountry: "uk", mealType: ["dinner"], prepTimeMinutes: 45, servings: 4,
    ingredients: [{ name: "Turkey mince", amount: "400g" }, { name: "Potatoes", amount: "500g" }, { name: "Carrots and peas", amount: "200g" }, { name: "Onion and garlic", amount: "1 each" }],
    instructions: ["Brown turkey mince with onion, garlic, carrots", "Add tomato paste, Worcestershire, broth, simmer", "Mash potatoes with a bit of butter and milk", "Top meat with mash, bake at 200C for 20 min"],
    nutrients: { calories: 420, protein: 35, carbohydrates: 38, fat: 14, fiber: 5 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "baked-salmon-veg", name: "Baked Salmon with Vegetables", description: "Oven-baked salmon fillet with roasted seasonal vegetables", cuisineCountry: "uk", mealType: ["dinner"], prepTimeMinutes: 30, servings: 2,
    ingredients: [{ name: "Salmon fillets", amount: "2x150g" }, { name: "Asparagus", amount: "200g" }, { name: "Cherry tomatoes", amount: "150g" }, { name: "Lemon and olive oil", amount: "1, 2 tbsp" }],
    instructions: ["Season salmon with lemon, dill, salt, pepper", "Arrange vegetables on baking tray with olive oil", "Place salmon on top, bake at 200C for 18 min", "Serve with lemon wedges"],
    nutrients: { calories: 420, protein: 38, carbohydrates: 10, fat: 24, fiber: 4 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto", "mediterranean"] },

  // ============ JAPAN ============
  { id: "tamagoyaki-rice", name: "Tamagoyaki with Rice", description: "Rolled Japanese omelette served with steamed rice and pickles", cuisineCountry: "japan", mealType: ["breakfast"], prepTimeMinutes: 15, servings: 1,
    ingredients: [{ name: "Eggs", amount: "3" }, { name: "Dashi stock", amount: "2 tbsp" }, { name: "Steamed rice", amount: "150g cooked" }, { name: "Soy sauce", amount: "1 tsp" }],
    instructions: ["Beat eggs with dashi, mirin, soy sauce", "Cook thin layers in rectangular pan, rolling as you go", "Slice tamagoyaki into pieces", "Serve with rice and pickled vegetables"],
    nutrients: { calories: 380, protein: 18, carbohydrates: 38, fat: 14, fiber: 1 }, tags: ["gluten-free"], dietCompatibility: ["balanced"] },
  { id: "chicken-teriyaki", name: "Chicken Teriyaki Bowl", description: "Glazed teriyaki chicken over rice with steamed vegetables", cuisineCountry: "japan", mealType: ["lunch", "dinner"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Chicken thighs", amount: "300g" }, { name: "Soy sauce and mirin", amount: "3 tbsp each" }, { name: "Steamed rice", amount: "300g cooked" }, { name: "Broccoli", amount: "200g" }],
    instructions: ["Score chicken, pan-fry skin-side down until crispy", "Flip, add teriyaki sauce, simmer until glazed", "Steam broccoli", "Slice chicken, serve over rice with broccoli"],
    nutrients: { calories: 520, protein: 35, carbohydrates: 52, fat: 16, fiber: 4 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "salmon-sashimi-bowl", name: "Salmon Sashimi Bowl", description: "Fresh salmon sashimi over seasoned sushi rice with avocado", cuisineCountry: "japan", mealType: ["lunch", "dinner"], prepTimeMinutes: 20, servings: 1,
    ingredients: [{ name: "Sashimi-grade salmon", amount: "150g" }, { name: "Sushi rice", amount: "150g cooked" }, { name: "Avocado", amount: "1/2" }, { name: "Nori and sesame seeds", amount: "1 sheet, 1 tsp" }],
    instructions: ["Season rice with rice vinegar, sugar, salt", "Slice salmon into thin pieces", "Arrange salmon and avocado over rice", "Garnish with nori strips and sesame seeds"],
    nutrients: { calories: 450, protein: 32, carbohydrates: 40, fat: 18, fiber: 4 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "mediterranean"] },
  { id: "edamame", name: "Edamame", description: "Steamed soybeans in pods with sea salt", cuisineCountry: "japan", mealType: ["snack"], prepTimeMinutes: 5, servings: 2,
    ingredients: [{ name: "Frozen edamame in pods", amount: "250g" }, { name: "Sea salt", amount: "1/2 tsp" }, { name: "Garlic (optional)", amount: "1 clove" }, { name: "Sesame oil", amount: "1 tsp" }],
    instructions: ["Boil or steam edamame 4 minutes", "Drain and toss with salt", "Optional: add minced garlic and sesame oil", "Serve warm"],
    nutrients: { calories: 180, protein: 16, carbohydrates: 12, fat: 8, fiber: 6 }, tags: ["vegan", "high-protein", "low-carb", "quick", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto"] },

  // ============ CHINA ============
  { id: "congee-chicken", name: "Congee with Chicken", description: "Silky rice porridge with shredded chicken and ginger", cuisineCountry: "china", mealType: ["breakfast"], prepTimeMinutes: 45, servings: 3,
    ingredients: [{ name: "Jasmine rice", amount: "100g" }, { name: "Chicken breast", amount: "200g" }, { name: "Ginger", amount: "2 inches" }, { name: "Green onions", amount: "3 stalks" }],
    instructions: ["Simmer rice in large amount of broth until porridge consistency", "Poach chicken separately, shred", "Serve congee topped with chicken, ginger, green onion", "Season with soy sauce and white pepper"],
    nutrients: { calories: 320, protein: 24, carbohydrates: 38, fat: 6, fiber: 1 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced"] },
  { id: "kung-pao-chicken", name: "Kung Pao Chicken", description: "Spicy stir-fried chicken with peanuts and dried chili peppers", cuisineCountry: "china", mealType: ["lunch", "dinner"], prepTimeMinutes: 20, servings: 2,
    ingredients: [{ name: "Chicken breast", amount: "300g" }, { name: "Peanuts", amount: "40g" }, { name: "Dried red chilies", amount: "6" }, { name: "Soy sauce and vinegar", amount: "2 tbsp each" }],
    instructions: ["Cube chicken, marinate in soy sauce and cornstarch", "Stir-fry chicken until cooked, set aside", "Fry dried chilies and Sichuan peppercorns", "Return chicken, add sauce and peanuts"],
    nutrients: { calories: 440, protein: 40, carbohydrates: 16, fat: 22, fiber: 3 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "steamed-fish-veg", name: "Steamed Fish with Vegetables", description: "Delicate steamed white fish with ginger, soy, and bok choy", cuisineCountry: "china", mealType: ["dinner"], prepTimeMinutes: 20, servings: 2,
    ingredients: [{ name: "White fish fillets", amount: "300g" }, { name: "Bok choy", amount: "200g" }, { name: "Ginger and green onion", amount: "2 inches, 3 stalks" }, { name: "Soy sauce and sesame oil", amount: "2 tbsp, 1 tsp" }],
    instructions: ["Place fish on plate with ginger slices", "Steam fish and bok choy for 8-10 minutes", "Heat oil until smoking, pour over fish and green onions", "Drizzle with soy sauce"],
    nutrients: { calories: 280, protein: 38, carbohydrates: 6, fat: 10, fiber: 2 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto", "mediterranean"] },

  // ============ INDIA ============
  { id: "masala-omelette", name: "Masala Omelette", description: "Spiced Indian omelette with onions, tomatoes, and green chilies", cuisineCountry: "india", mealType: ["breakfast"], prepTimeMinutes: 10, servings: 1,
    ingredients: [{ name: "Eggs", amount: "3" }, { name: "Onion", amount: "1 small" }, { name: "Tomato", amount: "1 small" }, { name: "Green chili and cilantro", amount: "1 each" }],
    instructions: ["Beat eggs with salt, turmeric, chili powder", "Mix in diced onion, tomato, chili, cilantro", "Cook in oiled pan until set", "Fold and serve with toast or roti"],
    nutrients: { calories: 280, protein: 20, carbohydrates: 8, fat: 18, fiber: 2 }, tags: ["vegetarian", "low-carb", "gluten-free", "quick"], dietCompatibility: ["balanced", "keto", "high_protein"] },
  { id: "chicken-tikka-masala", name: "Chicken Tikka Masala", description: "Marinated chicken in creamy tomato-spice sauce", cuisineCountry: "india", mealType: ["lunch", "dinner"], prepTimeMinutes: 35, servings: 3,
    ingredients: [{ name: "Chicken breast", amount: "400g" }, { name: "Yogurt", amount: "100g" }, { name: "Tomato sauce", amount: "2 cups" }, { name: "Garam masala and cream", amount: "2 tsp, 1/4 cup" }],
    instructions: ["Marinate chicken in yogurt and spices 30 min", "Grill or broil chicken pieces", "Make sauce: cook onion, garlic, ginger, add tomato and spices", "Add chicken to sauce, stir in cream, simmer"],
    nutrients: { calories: 420, protein: 38, carbohydrates: 18, fat: 20, fiber: 3 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "dal-rice", name: "Dal with Rice", description: "Comforting yellow lentil stew served with basmati rice", cuisineCountry: "india", mealType: ["dinner", "lunch"], prepTimeMinutes: 30, servings: 3,
    ingredients: [{ name: "Yellow lentils (moong dal)", amount: "200g" }, { name: "Basmati rice", amount: "200g" }, { name: "Tomato and onion", amount: "1 each" }, { name: "Cumin, turmeric, ghee", amount: "1 tsp each" }],
    instructions: ["Wash and boil lentils with turmeric until soft", "Cook rice separately", "Make tadka: heat ghee, add cumin, onion, tomato, spices", "Pour tadka over dal, serve with rice"],
    nutrients: { calories: 420, protein: 18, carbohydrates: 65, fat: 8, fiber: 10 }, tags: ["vegetarian", "vegan", "gluten-free"], dietCompatibility: ["balanced", "mediterranean"] },
  { id: "raita", name: "Vegetable Raita", description: "Cooling yogurt condiment with cucumber, mint, and cumin", cuisineCountry: "india", mealType: ["snack"], prepTimeMinutes: 5, servings: 2,
    ingredients: [{ name: "Yogurt", amount: "200g" }, { name: "Cucumber", amount: "1" }, { name: "Mint leaves", amount: "handful" }, { name: "Cumin powder", amount: "1/2 tsp" }],
    instructions: ["Grate or dice cucumber, squeeze out water", "Mix yogurt with cucumber and chopped mint", "Season with roasted cumin, salt, chili", "Chill and serve"],
    nutrients: { calories: 120, protein: 8, carbohydrates: 12, fat: 4, fiber: 1 }, tags: ["vegetarian", "low-carb", "gluten-free", "quick"], dietCompatibility: ["balanced", "mediterranean"] },

  // ============ THAILAND ============
  { id: "thai-omelette", name: "Kai Jeow (Thai Omelette)", description: "Crispy puffed Thai-style omelette with fish sauce", cuisineCountry: "thailand", mealType: ["breakfast"], prepTimeMinutes: 10, servings: 1,
    ingredients: [{ name: "Eggs", amount: "3" }, { name: "Fish sauce", amount: "1 tbsp" }, { name: "Green onions", amount: "2" }, { name: "Vegetable oil", amount: "3 tbsp" }],
    instructions: ["Beat eggs vigorously with fish sauce and white pepper", "Heat wok with oil until very hot", "Pour in eggs, they will puff up immediately", "Cook until golden, serve over rice"],
    nutrients: { calories: 320, protein: 18, carbohydrates: 2, fat: 26, fiber: 0 }, tags: ["low-carb", "gluten-free", "quick"], dietCompatibility: ["keto", "balanced"] },
  { id: "pad-thai-shrimp", name: "Pad Thai with Shrimp", description: "Stir-fried rice noodles with shrimp, peanuts, and tamarind sauce", cuisineCountry: "thailand", mealType: ["lunch", "dinner"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Rice noodles", amount: "200g" }, { name: "Shrimp", amount: "200g" }, { name: "Tamarind paste", amount: "2 tbsp" }, { name: "Peanuts and bean sprouts", amount: "30g, 1 cup" }],
    instructions: ["Soak noodles in warm water until pliable", "Stir-fry shrimp, set aside", "Cook noodles with tamarind sauce, fish sauce, sugar", "Add shrimp, egg, bean sprouts, top with peanuts and lime"],
    nutrients: { calories: 480, protein: 28, carbohydrates: 55, fat: 16, fiber: 3 }, tags: ["gluten-free"], dietCompatibility: ["balanced"] },
  { id: "green-curry-chicken", name: "Green Curry Chicken", description: "Creamy Thai green curry with chicken, bamboo, and Thai basil", cuisineCountry: "thailand", mealType: ["dinner"], prepTimeMinutes: 25, servings: 3,
    ingredients: [{ name: "Chicken thigh", amount: "350g" }, { name: "Coconut milk", amount: "400ml" }, { name: "Green curry paste", amount: "3 tbsp" }, { name: "Thai basil and bamboo", amount: "1 cup each" }],
    instructions: ["Fry curry paste in coconut cream until fragrant", "Add chicken pieces, cook until sealed", "Pour in remaining coconut milk, add bamboo", "Simmer 15 min, stir in Thai basil, serve with rice"],
    nutrients: { calories: 450, protein: 30, carbohydrates: 12, fat: 32, fiber: 3 }, tags: ["high-protein", "gluten-free", "low-carb"], dietCompatibility: ["balanced", "keto", "high_protein"] },

  // ============ KOREA ============
  { id: "gyeran-bap", name: "Gyeran-bap (Egg Rice)", description: "Korean comfort food: fried egg over hot rice with sesame oil and soy", cuisineCountry: "korea", mealType: ["breakfast"], prepTimeMinutes: 10, servings: 1,
    ingredients: [{ name: "Steamed rice", amount: "200g cooked" }, { name: "Eggs", amount: "2" }, { name: "Sesame oil", amount: "1 tsp" }, { name: "Soy sauce and sesame seeds", amount: "1 tbsp, 1 tsp" }],
    instructions: ["Place hot rice in bowl", "Fry eggs sunny-side up", "Place eggs on rice, drizzle sesame oil and soy sauce", "Sprinkle sesame seeds and mix before eating"],
    nutrients: { calories: 400, protein: 16, carbohydrates: 48, fat: 14, fiber: 1 }, tags: ["vegetarian", "quick"], dietCompatibility: ["balanced"] },
  { id: "bibimbap", name: "Bibimbap", description: "Mixed rice bowl with vegetables, beef, and gochujang sauce", cuisineCountry: "korea", mealType: ["lunch", "dinner"], prepTimeMinutes: 30, servings: 2,
    ingredients: [{ name: "Steamed rice", amount: "300g cooked" }, { name: "Lean beef", amount: "150g" }, { name: "Assorted vegetables", amount: "400g" }, { name: "Gochujang and sesame oil", amount: "2 tbsp each" }],
    instructions: ["Prepare each vegetable separately (spinach, carrots, zucchini, bean sprouts)", "Marinate and cook beef with soy sauce, garlic", "Arrange vegetables and beef over rice in bowl", "Top with fried egg and gochujang, mix before eating"],
    nutrients: { calories: 520, protein: 28, carbohydrates: 58, fat: 18, fiber: 6 }, tags: [], dietCompatibility: ["balanced"] },
  { id: "bulgogi", name: "Bulgogi", description: "Korean marinated grilled beef with sweet soy-pear sauce", cuisineCountry: "korea", mealType: ["dinner"], prepTimeMinutes: 30, servings: 3,
    ingredients: [{ name: "Beef sirloin (thinly sliced)", amount: "400g" }, { name: "Soy sauce", amount: "4 tbsp" }, { name: "Asian pear", amount: "1/2" }, { name: "Garlic, ginger, sesame oil", amount: "3 cloves, 1 inch, 2 tbsp" }],
    instructions: ["Blend pear, soy sauce, garlic, ginger, sugar for marinade", "Marinate beef at least 30 min", "Grill or pan-fry on high heat", "Serve with rice, lettuce wraps, and kimchi"],
    nutrients: { calories: 380, protein: 35, carbohydrates: 16, fat: 18, fiber: 1 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },

  // ============ LEBANON ============
  { id: "labneh-pita", name: "Labneh with Pita", description: "Thick strained yogurt drizzled with olive oil and za'atar, with warm pita", cuisineCountry: "lebanon", mealType: ["breakfast", "snack"], prepTimeMinutes: 5, servings: 2,
    ingredients: [{ name: "Labneh", amount: "200g" }, { name: "Pita bread", amount: "2" }, { name: "Olive oil", amount: "2 tbsp" }, { name: "Za'atar", amount: "1 tbsp" }],
    instructions: ["Spread labneh on a plate", "Make a well in center, pool olive oil", "Sprinkle za'atar generously", "Serve with warm pita for dipping"],
    nutrients: { calories: 350, protein: 12, carbohydrates: 32, fat: 20, fiber: 2 }, tags: ["vegetarian", "quick"], dietCompatibility: ["balanced", "mediterranean"] },
  { id: "chicken-shawarma", name: "Chicken Shawarma", description: "Spiced rotisserie-style chicken with garlic sauce in pita", cuisineCountry: "lebanon", mealType: ["lunch"], prepTimeMinutes: 30, servings: 3,
    ingredients: [{ name: "Chicken thighs", amount: "500g" }, { name: "Shawarma spice mix", amount: "2 tbsp" }, { name: "Pita bread", amount: "3" }, { name: "Garlic sauce (toum)", amount: "3 tbsp" }],
    instructions: ["Marinate chicken in spices, yogurt, lemon juice", "Roast or grill until charred and cooked through", "Slice thinly", "Serve in warm pita with garlic sauce, pickles, vegetables"],
    nutrients: { calories: 480, protein: 38, carbohydrates: 32, fat: 20, fiber: 2 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "kafta-tabbouleh", name: "Kafta with Tabbouleh", description: "Spiced lamb and beef skewers with fresh parsley-bulgur salad", cuisineCountry: "lebanon", mealType: ["dinner"], prepTimeMinutes: 30, servings: 3,
    ingredients: [{ name: "Ground lamb/beef mix", amount: "400g" }, { name: "Parsley", amount: "2 large bunches" }, { name: "Bulgur wheat", amount: "60g" }, { name: "Tomatoes and lemon", amount: "2 each" }],
    instructions: ["Mix meat with onion, parsley, spices, form on skewers", "Grill kafta until cooked through", "Soak bulgur, mix with chopped parsley, tomato, lemon, olive oil", "Serve kafta alongside tabbouleh"],
    nutrients: { calories: 450, protein: 32, carbohydrates: 22, fat: 24, fiber: 5 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein", "mediterranean"] },

  // ============ TURKEY ============
  { id: "menemen", name: "Menemen", description: "Turkish scrambled eggs with tomatoes, peppers, and spices", cuisineCountry: "turkey", mealType: ["breakfast"], prepTimeMinutes: 15, servings: 2,
    ingredients: [{ name: "Eggs", amount: "4" }, { name: "Tomatoes", amount: "3" }, { name: "Green peppers", amount: "2" }, { name: "Olive oil and red pepper flakes", amount: "2 tbsp, 1 tsp" }],
    instructions: ["Sauté diced peppers in olive oil", "Add diced tomatoes, cook until soft", "Pour in beaten eggs, stir gently", "Season with red pepper flakes, serve with bread"],
    nutrients: { calories: 280, protein: 16, carbohydrates: 12, fat: 18, fiber: 3 }, tags: ["vegetarian", "low-carb", "gluten-free", "quick"], dietCompatibility: ["balanced", "keto", "mediterranean"] },
  { id: "chicken-doner", name: "Chicken Döner", description: "Spiced chicken döner kebab with yogurt sauce and vegetables", cuisineCountry: "turkey", mealType: ["lunch"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Chicken thighs", amount: "400g" }, { name: "Yogurt", amount: "100g" }, { name: "Flatbread", amount: "2" }, { name: "Tomato, onion, lettuce", amount: "1 each" }],
    instructions: ["Marinate chicken in yogurt, cumin, paprika, garlic", "Cook chicken on grill or in oven until charred", "Slice thinly against the grain", "Serve in flatbread with yogurt sauce and vegetables"],
    nutrients: { calories: 520, protein: 40, carbohydrates: 35, fat: 22, fiber: 3 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "iskender-kebab", name: "İskender Kebab", description: "Sliced döner over pita with tomato sauce and melted butter", cuisineCountry: "turkey", mealType: ["dinner"], prepTimeMinutes: 30, servings: 2,
    ingredients: [{ name: "Lamb döner meat", amount: "300g" }, { name: "Pita bread", amount: "2" }, { name: "Tomato sauce", amount: "1 cup" }, { name: "Butter and yogurt", amount: "2 tbsp, 200g" }],
    instructions: ["Slice döner meat thinly", "Cut pita into pieces, place on plate", "Layer meat over pita, pour hot tomato sauce", "Top with melted butter and serve yogurt on side"],
    nutrients: { calories: 580, protein: 35, carbohydrates: 38, fat: 30, fiber: 3 }, tags: ["high-protein"], dietCompatibility: ["balanced"] },

  // ============ MOROCCO ============
  { id: "msemen-honey", name: "Msemen with Honey", description: "Flaky Moroccan flatbread served with honey and butter", cuisineCountry: "morocco", mealType: ["breakfast"], prepTimeMinutes: 30, servings: 4,
    ingredients: [{ name: "Flour", amount: "300g" }, { name: "Semolina", amount: "100g" }, { name: "Butter", amount: "60g" }, { name: "Honey", amount: "4 tbsp" }],
    instructions: ["Mix flour, semolina, salt, water into dough", "Divide into balls, flatten thin, fold with butter", "Cook on griddle until golden on both sides", "Serve warm with honey drizzled on top"],
    nutrients: { calories: 350, protein: 7, carbohydrates: 52, fat: 12, fiber: 2 }, tags: ["vegetarian"], dietCompatibility: ["balanced"] },
  { id: "chicken-tagine", name: "Chicken Tagine", description: "Slow-cooked chicken with preserved lemons, olives, and saffron", cuisineCountry: "morocco", mealType: ["lunch", "dinner"], prepTimeMinutes: 60, servings: 4,
    ingredients: [{ name: "Chicken pieces", amount: "800g" }, { name: "Preserved lemons", amount: "2" }, { name: "Green olives", amount: "100g" }, { name: "Saffron and ginger", amount: "pinch, 1 tsp" }],
    instructions: ["Brown chicken in olive oil with onion", "Add saffron, ginger, turmeric, cinnamon, water", "Simmer covered for 45 min", "Add preserved lemons and olives, cook 10 min more"],
    nutrients: { calories: 380, protein: 35, carbohydrates: 8, fat: 22, fiber: 2 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto"] },
  { id: "harira", name: "Harira Soup", description: "Hearty Moroccan soup with lentils, chickpeas, tomatoes, and lamb", cuisineCountry: "morocco", mealType: ["dinner"], prepTimeMinutes: 50, servings: 4,
    ingredients: [{ name: "Lamb shoulder", amount: "200g" }, { name: "Lentils and chickpeas", amount: "100g each" }, { name: "Tomatoes", amount: "400g" }, { name: "Cilantro and ginger", amount: "bunch, 1 tsp" }],
    instructions: ["Brown lamb cubes in pot", "Add onion, celery, spices, tomatoes, and water", "Add lentils and chickpeas, simmer 40 min", "Finish with lemon juice and fresh cilantro"],
    nutrients: { calories: 380, protein: 28, carbohydrates: 35, fat: 12, fiber: 10 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },

  // ============ NIGERIA ============
  { id: "akara", name: "Akara", description: "Crispy black-eyed pea fritters, popular Nigerian breakfast", cuisineCountry: "nigeria", mealType: ["breakfast", "snack"], prepTimeMinutes: 30, servings: 4,
    ingredients: [{ name: "Black-eyed peas", amount: "300g" }, { name: "Onion", amount: "1 large" }, { name: "Scotch bonnet pepper", amount: "1" }, { name: "Oil for frying", amount: "2 cups" }],
    instructions: ["Soak peas, remove skins, blend into paste", "Mix with onion, pepper, salt", "Form into balls", "Deep fry until golden and crispy"],
    nutrients: { calories: 250, protein: 12, carbohydrates: 28, fat: 10, fiber: 6 }, tags: ["vegan", "gluten-free"], dietCompatibility: ["balanced"] },
  { id: "jollof-rice", name: "Jollof Rice with Chicken", description: "West African tomato rice with grilled chicken", cuisineCountry: "nigeria", mealType: ["lunch", "dinner"], prepTimeMinutes: 50, servings: 4,
    ingredients: [{ name: "Long grain rice", amount: "400g" }, { name: "Chicken pieces", amount: "600g" }, { name: "Tomato paste and fresh tomatoes", amount: "3 tbsp, 4" }, { name: "Scotch bonnet and onion", amount: "1 each" }],
    instructions: ["Season and grill chicken pieces", "Blend tomatoes, peppers, onion into paste, fry in oil", "Add rice and stock, cook covered until rice is done", "Serve rice with grilled chicken"],
    nutrients: { calories: 550, protein: 35, carbohydrates: 55, fat: 18, fiber: 3 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "pepper-soup", name: "Pepper Soup", description: "Spicy aromatic Nigerian broth with catfish and herbs", cuisineCountry: "nigeria", mealType: ["dinner"], prepTimeMinutes: 35, servings: 3,
    ingredients: [{ name: "Catfish", amount: "400g" }, { name: "Pepper soup spice", amount: "2 tbsp" }, { name: "Scotch bonnet", amount: "2" }, { name: "Scent leaves and uziza", amount: "handful each" }],
    instructions: ["Cut fish into chunks, season with salt and spice", "Boil fish in water with onion and pepper", "Add pepper soup spice and chili", "Simmer 15 min, add fresh herbs before serving"],
    nutrients: { calories: 280, protein: 32, carbohydrates: 6, fat: 14, fiber: 1 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto"] },

  // ============ AUSTRALIA ============
  { id: "avo-toast-eggs", name: "Avocado Toast with Eggs", description: "Smashed avocado on sourdough with poached eggs and chili flakes", cuisineCountry: "australia", mealType: ["breakfast"], prepTimeMinutes: 10, servings: 1,
    ingredients: [{ name: "Sourdough bread", amount: "2 slices" }, { name: "Avocado", amount: "1" }, { name: "Eggs", amount: "2" }, { name: "Chili flakes and lemon", amount: "pinch, squeeze" }],
    instructions: ["Toast sourdough slices", "Mash avocado with lemon, salt, pepper", "Poach eggs in simmering water", "Spread avocado on toast, top with eggs and chili flakes"],
    nutrients: { calories: 450, protein: 20, carbohydrates: 35, fat: 26, fiber: 8 }, tags: ["vegetarian"], dietCompatibility: ["balanced", "mediterranean"] },
  { id: "lean-burger", name: "Lean Aussie Burger", description: "Grilled lean beef patty with beetroot, egg, and pineapple", cuisineCountry: "australia", mealType: ["lunch"], prepTimeMinutes: 20, servings: 1,
    ingredients: [{ name: "Lean beef mince (95%)", amount: "150g" }, { name: "Whole wheat bun", amount: "1" }, { name: "Beetroot and egg", amount: "2 slices, 1" }, { name: "Lettuce and tomato", amount: "leaves, 1 slice" }],
    instructions: ["Form patty from seasoned mince", "Grill patty to desired doneness", "Fry egg", "Assemble: bun, lettuce, patty, egg, beetroot, tomato"],
    nutrients: { calories: 480, protein: 38, carbohydrates: 32, fat: 20, fiber: 4 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "barramundi-veg", name: "Barramundi with Vegetables", description: "Pan-seared barramundi with roasted Mediterranean vegetables", cuisineCountry: "australia", mealType: ["dinner"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Barramundi fillets", amount: "2x180g" }, { name: "Zucchini and capsicum", amount: "200g" }, { name: "Cherry tomatoes", amount: "150g" }, { name: "Lemon and olive oil", amount: "1, 2 tbsp" }],
    instructions: ["Season fish with lemon, herbs, salt", "Roast vegetables at 200C for 15 min", "Pan-sear barramundi skin-side down 4 min, flip 2 min", "Serve fish over roasted vegetables"],
    nutrients: { calories: 380, protein: 38, carbohydrates: 12, fat: 18, fiber: 4 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto", "mediterranean"] },
  { id: "protein-smoothie-bowl", name: "Protein Smoothie Bowl", description: "Thick banana-berry blend topped with seeds and nut butter", cuisineCountry: "australia", mealType: ["snack"], prepTimeMinutes: 5, servings: 1,
    ingredients: [{ name: "Frozen bananas", amount: "2" }, { name: "Mixed berries", amount: "100g" }, { name: "Protein powder", amount: "30g" }, { name: "Almond butter", amount: "1 tbsp" }],
    instructions: ["Blend frozen bananas and berries until thick", "Pour into bowl", "Top with almond butter, seeds, and granola", "Serve immediately"],
    nutrients: { calories: 380, protein: 24, carbohydrates: 50, fat: 12, fiber: 6 }, tags: ["vegetarian", "gluten-free", "quick"], dietCompatibility: ["balanced", "high_protein"] },

  // ============ ADDITIONAL RECIPES ============
  { id: "huevos-rancheros", name: "Huevos Rancheros", description: "Eggs on crispy tortillas with ranchero sauce and beans", cuisineCountry: "mexico", mealType: ["breakfast"], prepTimeMinutes: 20, servings: 2,
    ingredients: [{ name: "Eggs", amount: "4" }, { name: "Corn tortillas", amount: "4" }, { name: "Ranchero salsa", amount: "1.5 cups" }, { name: "Black beans", amount: "1 cup cooked" }],
    instructions: ["Fry tortillas until lightly crispy", "Heat ranchero salsa in a pan", "Fry eggs sunny-side up", "Place eggs on tortillas, spoon salsa over, serve with beans"],
    nutrients: { calories: 440, protein: 22, carbohydrates: 42, fat: 20, fiber: 8 }, tags: ["vegetarian", "gluten-free"], dietCompatibility: ["balanced"] },
  { id: "sancocho", name: "Sancocho", description: "Hearty Colombian stew with chicken, corn, plantain, and yuca", cuisineCountry: "colombia", mealType: ["dinner"], prepTimeMinutes: 60, servings: 6,
    ingredients: [{ name: "Chicken pieces", amount: "600g" }, { name: "Yuca", amount: "200g" }, { name: "Green plantain", amount: "2" }, { name: "Corn on the cob", amount: "3" }],
    instructions: ["Boil chicken with onion, garlic, cilantro stems", "Add cubed yuca and plantain, simmer 20 min", "Add corn pieces, cook another 15 min", "Serve with rice, avocado, and lime"],
    nutrients: { calories: 420, protein: 30, carbohydrates: 48, fat: 12, fiber: 5 }, tags: ["high-protein", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "asado-veggies", name: "Asado-Style Grilled Vegetables", description: "Argentine grilled mixed vegetables with chimichurri", cuisineCountry: "argentina", mealType: ["lunch", "dinner"], prepTimeMinutes: 20, servings: 3,
    ingredients: [{ name: "Bell peppers", amount: "2" }, { name: "Eggplant", amount: "1" }, { name: "Zucchini", amount: "2" }, { name: "Chimichurri sauce", amount: "1/3 cup" }],
    instructions: ["Slice vegetables into thick pieces", "Brush with olive oil, season with salt", "Grill on high heat until charred and tender", "Drizzle generously with chimichurri"],
    nutrients: { calories: 180, protein: 4, carbohydrates: 16, fat: 12, fiber: 5 }, tags: ["vegan", "low-carb", "gluten-free", "quick"], dietCompatibility: ["balanced", "keto", "mediterranean"] },
  { id: "acai-protein-smoothie", name: "Açaí Protein Smoothie", description: "Thick açaí and banana smoothie with whey protein", cuisineCountry: "brazil", mealType: ["snack"], prepTimeMinutes: 5, servings: 1,
    ingredients: [{ name: "Frozen açaí pulp", amount: "100g" }, { name: "Banana", amount: "1" }, { name: "Whey protein", amount: "30g" }, { name: "Milk", amount: "200ml" }],
    instructions: ["Blend all ingredients until smooth", "Add ice if desired for thicker consistency", "Pour into glass", "Enjoy immediately"],
    nutrients: { calories: 340, protein: 28, carbohydrates: 40, fat: 8, fiber: 5 }, tags: ["high-protein", "vegetarian", "quick", "gluten-free"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "turkey-meatballs", name: "Turkey Meatballs with Marinara", description: "Lean turkey meatballs in homemade tomato basil sauce", cuisineCountry: "usa", mealType: ["dinner"], prepTimeMinutes: 30, servings: 3,
    ingredients: [{ name: "Ground turkey", amount: "400g" }, { name: "Crushed tomatoes", amount: "400g" }, { name: "Garlic and basil", amount: "3 cloves, handful" }, { name: "Whole wheat pasta", amount: "200g" }],
    instructions: ["Mix turkey with breadcrumbs, egg, garlic, herbs, form balls", "Bake meatballs at 200C for 15 min", "Simmer crushed tomatoes with garlic and basil for sauce", "Toss meatballs with sauce, serve over pasta"],
    nutrients: { calories: 480, protein: 38, carbohydrates: 42, fat: 16, fiber: 5 }, tags: ["high-protein"], dietCompatibility: ["balanced", "high_protein"] },
  { id: "risotto-funghi", name: "Risotto ai Funghi", description: "Creamy mushroom risotto with parmesan and thyme", cuisineCountry: "italy", mealType: ["dinner"], prepTimeMinutes: 35, servings: 3,
    ingredients: [{ name: "Arborio rice", amount: "250g" }, { name: "Mixed mushrooms", amount: "300g" }, { name: "Parmesan", amount: "60g" }, { name: "Vegetable broth", amount: "1 liter" }],
    instructions: ["Sauté mushrooms in butter, set aside", "Toast rice in olive oil, add wine", "Add broth one ladle at a time, stirring constantly", "Finish with mushrooms, parmesan, and butter"],
    nutrients: { calories: 420, protein: 14, carbohydrates: 56, fat: 14, fiber: 3 }, tags: ["vegetarian"], dietCompatibility: ["balanced", "mediterranean"] },
  { id: "quiche-lorraine", name: "Quiche Lorraine", description: "French savory tart with bacon, cheese, and eggs in flaky crust", cuisineCountry: "france", mealType: ["lunch", "breakfast"], prepTimeMinutes: 50, servings: 6,
    ingredients: [{ name: "Pie crust", amount: "1" }, { name: "Bacon lardons", amount: "150g" }, { name: "Eggs and cream", amount: "4, 200ml" }, { name: "Gruyère cheese", amount: "100g" }],
    instructions: ["Blind bake pie crust at 200C for 10 min", "Cook bacon until crispy", "Whisk eggs with cream, season with nutmeg", "Layer bacon and cheese in crust, pour egg mixture, bake 30 min"],
    nutrients: { calories: 380, protein: 18, carbohydrates: 20, fat: 24, fiber: 1 }, tags: [], dietCompatibility: ["balanced"] },
  { id: "miso-soup", name: "Miso Soup with Tofu", description: "Traditional Japanese soup with silken tofu, wakame, and green onions", cuisineCountry: "japan", mealType: ["snack", "breakfast"], prepTimeMinutes: 10, servings: 2,
    ingredients: [{ name: "White miso paste", amount: "3 tbsp" }, { name: "Silken tofu", amount: "150g" }, { name: "Dried wakame", amount: "1 tbsp" }, { name: "Dashi stock", amount: "600ml" }],
    instructions: ["Heat dashi stock, add rehydrated wakame", "Cube tofu and add to soup", "Dissolve miso paste in ladle of broth, stir in", "Garnish with sliced green onions"],
    nutrients: { calories: 120, protein: 10, carbohydrates: 10, fat: 4, fiber: 2 }, tags: ["vegan", "low-carb", "quick", "gluten-free"], dietCompatibility: ["balanced", "keto", "mediterranean"] },
  { id: "tandoori-salmon", name: "Tandoori Salmon", description: "Salmon marinated in yogurt and tandoori spices, oven-baked", cuisineCountry: "india", mealType: ["dinner"], prepTimeMinutes: 25, servings: 2,
    ingredients: [{ name: "Salmon fillets", amount: "2x180g" }, { name: "Yogurt", amount: "100g" }, { name: "Tandoori spice mix", amount: "2 tbsp" }, { name: "Lemon and cilantro", amount: "1, handful" }],
    instructions: ["Mix yogurt with tandoori spices and lemon juice", "Coat salmon fillets in marinade, rest 15 min", "Bake at 200C for 15 minutes", "Serve with cilantro, lemon wedges, and raita"],
    nutrients: { calories: 380, protein: 36, carbohydrates: 6, fat: 22, fiber: 1 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto"] },
  { id: "tom-yum-shrimp", name: "Tom Yum Goong", description: "Hot and sour Thai shrimp soup with lemongrass and galangal", cuisineCountry: "thailand", mealType: ["dinner", "lunch"], prepTimeMinutes: 25, servings: 3,
    ingredients: [{ name: "Shrimp", amount: "300g" }, { name: "Lemongrass", amount: "3 stalks" }, { name: "Mushrooms", amount: "150g" }, { name: "Lime juice and chili paste", amount: "3 tbsp, 2 tbsp" }],
    instructions: ["Boil broth with lemongrass, galangal, kaffir lime leaves", "Add mushrooms, cook 3 min", "Add shrimp, cook until pink", "Season with fish sauce, lime juice, and chili paste"],
    nutrients: { calories: 220, protein: 28, carbohydrates: 10, fat: 6, fiber: 2 }, tags: ["high-protein", "low-carb", "gluten-free"], dietCompatibility: ["balanced", "high_protein", "keto"] },
  { id: "kimchi-jjigae", name: "Kimchi Jjigae", description: "Spicy Korean kimchi stew with tofu and pork", cuisineCountry: "korea", mealType: ["dinner"], prepTimeMinutes: 25, servings: 3,
    ingredients: [{ name: "Aged kimchi", amount: "300g" }, { name: "Pork belly (lean)", amount: "150g" }, { name: "Firm tofu", amount: "200g" }, { name: "Gochugaru and garlic", amount: "1 tbsp, 3 cloves" }],
    instructions: ["Sauté pork with kimchi in pot", "Add water or anchovy broth, bring to boil", "Add cubed tofu, green onions, gochugaru", "Simmer 15 min, serve bubbling with rice"],
    nutrients: { calories: 350, protein: 24, carbohydrates: 12, fat: 22, fiber: 4 }, tags: ["gluten-free"], dietCompatibility: ["balanced"] },
  { id: "hummus-plate", name: "Hummus Plate", description: "Creamy homemade hummus with olive oil, paprika, and warm pita", cuisineCountry: "lebanon", mealType: ["snack"], prepTimeMinutes: 10, servings: 4,
    ingredients: [{ name: "Chickpeas", amount: "400g" }, { name: "Tahini", amount: "3 tbsp" }, { name: "Lemon juice and garlic", amount: "3 tbsp, 2 cloves" }, { name: "Olive oil and pita", amount: "2 tbsp, 4" }],
    instructions: ["Blend chickpeas with tahini, lemon, garlic, ice water", "Process until extremely smooth", "Plate, make well for olive oil, sprinkle paprika", "Serve with warm pita bread"],
    nutrients: { calories: 320, protein: 12, carbohydrates: 38, fat: 14, fiber: 8 }, tags: ["vegan"], dietCompatibility: ["balanced", "mediterranean"] },
];

// Helper functions
export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

export function getRecipesByCuisine(country: string): Recipe[] {
  return RECIPES.filter((r) => r.cuisineCountry === country);
}

export function getRecipesByMealType(type: string): Recipe[] {
  return RECIPES.filter((r) => r.mealType.includes(type as Recipe["mealType"][number]));
}

export function getRecipesByTags(tags: string[]): Recipe[] {
  return RECIPES.filter((r) => tags.some((t) => r.tags.includes(t)));
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.toLowerCase();
  return RECIPES.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.cuisineCountry.toLowerCase().includes(q)
  );
}
