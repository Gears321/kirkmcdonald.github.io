/**
 * Unit tests for visualizer direction functionality
 */

import { getDefaultVisDirection, setVisualizerDirection, changeVisDir } from '../events.js';

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
        console.log('Running Visualizer Direction Tests...\n');
        
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
}

const test = new TestFramework();

// Test default visualizer direction
test.test('Default direction should be "right" for sankey type', () => {
    // Mock visualizerType
    const originalVisualizerType = window.visualizerType;
    window.visualizerType = 'sankey';
    
    const defaultDir = getDefaultVisDirection();
    test.assertEqual(defaultDir, 'right', 'Default direction for sankey should be "right"');
    
    // Restore
    window.visualizerType = originalVisualizerType;
});

test.test('Default direction should be "down" for non-sankey type', () => {
    // Mock visualizerType
    const originalVisualizerType = window.visualizerType;
    window.visualizerType = 'boxline';
    
    const defaultDir = getDefaultVisDirection();
    test.assertEqual(defaultDir, 'down', 'Default direction for boxline should be "down"');
    
    // Restore
    window.visualizerType = originalVisualizerType;
});

test.test('Should be able to set visualizer direction to "left"', () => {
    setVisualizerDirection('left');
    
    // Check if the direction was set in the global variable
    import('../events.js').then(events => {
        test.assertEqual(events.visualizerDirection, 'left', 'Visualizer direction should be set to "left"');
    });
});

test.test('Should be able to set visualizer direction to "right"', () => {
    setVisualizerDirection('right');
    
    import('../events.js').then(events => {
        test.assertEqual(events.visualizerDirection, 'right', 'Visualizer direction should be set to "right"');
    });
});

test.test('Should be able to set visualizer direction to "down"', () => {
    setVisualizerDirection('down');
    
    import('../events.js').then(events => {
        test.assertEqual(events.visualizerDirection, 'down', 'Visualizer direction should be set to "down"');
    });
});

// Test HTML form integration
test.test('Should have right-to-left option in HTML form', () => {
    // This test would need to run in a browser environment with the HTML loaded
    if (typeof document !== 'undefined') {
        const leftDirectionRadio = document.getElementById('left_direction');
        test.assert(leftDirectionRadio !== null, 'Left direction radio button should exist');
        test.assertEqual(leftDirectionRadio.value, 'left', 'Left direction radio should have value "left"');
    } else {
        console.log('Skipping HTML test - not in browser environment');
    }
});

// Export the test runner
export { test };

// Auto-run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    test.run().then(success => {
        process.exit(success ? 0 : 1);
    });
}