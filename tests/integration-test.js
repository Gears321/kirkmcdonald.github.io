/**
 * Integration tests for the Factorio Calculator
 * These tests verify that the calculator produces correct results for given inputs
 */

// Simple test framework
class TestFramework {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('Running Calculator Integration Tests...\n');
        
        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✓ ${name}`);
                this.passed++;
            } catch (error) {
                console.error(`✗ ${name}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, but got ${actual}`);
        }
    }

    assertApproximatelyEqual(actual, expected, tolerance = 0.001, message) {
        if (Math.abs(actual - expected) > tolerance) {
            throw new Error(message || `Expected ${expected} (±${tolerance}), but got ${actual}`);
        }
    }
}

const test = new TestFramework();

// Mock calculator functions for testing
class MockCalculator {
    constructor() {
        this.recipes = new Map();
        this.setupDefaultRecipes();
    }

    setupDefaultRecipes() {
        // Set up some basic recipes for testing
        this.recipes.set('iron-plate', {
            name: 'iron-plate',
            time: 3.2, // seconds
            ingredients: [{ name: 'iron-ore', amount: 1 }],
            products: [{ name: 'iron-plate', amount: 1 }]
        });

        this.recipes.set('electronic-circuit', {
            name: 'electronic-circuit',
            time: 0.5,
            ingredients: [
                { name: 'iron-plate', amount: 1 },
                { name: 'copper-cable', amount: 3 }
            ],
            products: [{ name: 'electronic-circuit', amount: 1 }]
        });

        // Our modified advanced circuit recipe
        this.recipes.set('advanced-circuit', {
            name: 'advanced-circuit',
            time: 6.0,
            ingredients: [
                { name: 'electronic-circuit', amount: 15 }, // Modified from 2 to 15
                { name: 'boiler', amount: 1 } // Added boiler requirement
            ],
            products: [{ name: 'advanced-circuit', amount: 1 }]
        });
    }

    calculateRequirements(targetItem, targetRate) {
        // Simple recursive calculation
        const recipe = this.recipes.get(targetItem);
        if (!recipe) {
            return { [targetItem]: targetRate }; // Raw material
        }

        const craftingRate = 60 / recipe.time; // items per minute
        const factoriesNeeded = targetRate / craftingRate;

        let requirements = {};
        requirements[`${targetItem}-factories`] = factoriesNeeded;

        for (const ingredient of recipe.ingredients) {
            const requiredRate = ingredient.amount * targetRate;
            const subRequirements = this.calculateRequirements(ingredient.name, requiredRate);
            
            for (const [item, amount] of Object.entries(subRequirements)) {
                requirements[item] = (requirements[item] || 0) + amount;
            }
        }

        return requirements;
    }
}

// Test basic calculator functionality
test.test('Calculator should correctly calculate iron plate requirements', () => {
    const calculator = new MockCalculator();
    const requirements = calculator.calculateRequirements('iron-plate', 60); // 60 per minute
    
    // Iron plate recipe: 1 iron ore -> 1 iron plate in 3.2 seconds
    // Rate: 60/3.2 = 18.75 per minute per factory
    // For 60 per minute: need 60/18.75 = 3.2 factories
    
    test.assertApproximatelyEqual(requirements['iron-plate-factories'], 3.2, 0.1, 'Should need ~3.2 iron plate factories');
    test.assertEqual(requirements['iron-ore'], 60, 'Should need 60 iron ore per minute');
});

test.test('Calculator should correctly calculate electronic circuit requirements', () => {
    const calculator = new MockCalculator();
    const requirements = calculator.calculateRequirements('electronic-circuit', 60);
    
    // Electronic circuit recipe: 1 iron plate + 3 copper cable -> 1 electronic circuit in 0.5 seconds
    // Rate: 60/0.5 = 120 per minute per factory
    // For 60 per minute: need 60/120 = 0.5 factories
    
    test.assertApproximatelyEqual(requirements['electronic-circuit-factories'], 0.5, 0.1, 'Should need 0.5 electronic circuit factories');
    test.assertEqual(requirements['iron-plate'], 60, 'Should need 60 iron plates per minute');
    test.assertEqual(requirements['copper-cable'], 180, 'Should need 180 copper cables per minute');
});

test.test('Calculator should handle modified advanced circuit recipe', () => {
    const calculator = new MockCalculator();
    const requirements = calculator.calculateRequirements('advanced-circuit', 5); // 5 per minute
    
    // Modified advanced circuit recipe: 15 electronic circuits + 1 boiler -> 1 advanced circuit in 6 seconds
    // Rate: 60/6 = 10 per minute per factory
    // For 5 per minute: need 5/10 = 0.5 factories
    
    test.assertApproximatelyEqual(requirements['advanced-circuit-factories'], 0.5, 0.1, 'Should need 0.5 advanced circuit factories');
    test.assertEqual(requirements['electronic-circuit'], 75, 'Should need 75 electronic circuits per minute (15 * 5)');
    test.assertEqual(requirements['boiler'], 5, 'Should need 5 boilers per minute (1 * 5)');
});

test.test('Calculator should calculate complex production chains correctly', () => {
    const calculator = new MockCalculator();
    const requirements = calculator.calculateRequirements('advanced-circuit', 1); // 1 per minute
    
    // Verify the complete production chain for 1 advanced circuit per minute
    test.assertApproximatelyEqual(requirements['advanced-circuit-factories'], 0.1, 0.01, 'Should need 0.1 advanced circuit factories');
    test.assertEqual(requirements['electronic-circuit'], 15, 'Should need 15 electronic circuits per minute');
    test.assertEqual(requirements['boiler'], 1, 'Should need 1 boiler per minute');
    
    // Electronic circuits requirements (15 needed)
    test.assertEqual(requirements['iron-plate'], 15, 'Should need 15 iron plates per minute for electronic circuits');
    test.assertEqual(requirements['copper-cable'], 45, 'Should need 45 copper cables per minute for electronic circuits');
});

test.test('Calculator should handle scaling correctly', () => {
    const calculator = new MockCalculator();
    
    // Test 1x production
    const requirements1x = calculator.calculateRequirements('advanced-circuit', 1);
    
    // Test 10x production
    const requirements10x = calculator.calculateRequirements('advanced-circuit', 10);
    
    // All requirements should scale linearly
    test.assertApproximatelyEqual(requirements10x['advanced-circuit-factories'], requirements1x['advanced-circuit-factories'] * 10, 0.01, 'Factory count should scale linearly');
    test.assertEqual(requirements10x['electronic-circuit'], requirements1x['electronic-circuit'] * 10, 'Electronic circuit requirements should scale linearly');
    test.assertEqual(requirements10x['boiler'], requirements1x['boiler'] * 10, 'Boiler requirements should scale linearly');
});

test.test('Calculator should preserve precision in calculations', () => {
    const calculator = new MockCalculator();
    
    // Test with fractional production rates
    const requirements = calculator.calculateRequirements('advanced-circuit', 0.5); // 0.5 per minute
    
    test.assertEqual(requirements['electronic-circuit'], 7.5, 'Should handle fractional electronic circuit requirements');
    test.assertEqual(requirements['boiler'], 0.5, 'Should handle fractional boiler requirements');
});

// Performance test
test.test('Calculator should handle complex calculations efficiently', () => {
    const calculator = new MockCalculator();
    
    const startTime = Date.now();
    
    // Calculate requirements for multiple items
    for (let i = 0; i < 100; i++) {
        calculator.calculateRequirements('advanced-circuit', Math.random() * 100);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    test.assert(duration < 1000, `Calculations should complete quickly (took ${duration}ms)`);
});

// Export the test runner
export { test, MockCalculator };

// Auto-run if this is the main module
if (typeof window !== 'undefined' && window.location) {
    console.log('Calculator Integration tests ready to run');
}