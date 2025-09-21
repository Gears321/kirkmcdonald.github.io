# Factorio Calculator - Test Suite

This directory contains unit and integration tests for the Factorio Calculator modifications.

## Features Tested

### 1. Visualizer Direction Enhancement
- Tests for the new "Right to left" visualizer direction option
- Verifies proper integration with existing direction options
- Confirms correct default behaviors for different visualizer types

### 2. Dropdown UI Improvement
- Tests for the enlarged dropdown interface
- Verifies improved user experience with larger selection area
- Confirms proper CSS styling and positioning

### 3. Recipe Modification
- Tests for the modified Advanced Circuit recipe
- Verifies the recipe now requires 15 electronic circuits (instead of 2)
- Confirms the addition of boiler as a required ingredient
- Ensures other recipes remain unaffected

### 4. Integration Tests
- End-to-end calculator functionality tests
- Verifies correct production calculations
- Tests scaling and precision handling
- Performance validation

## Running the Tests

### Browser-based Test Runner
1. Start a local web server in the project directory
2. Navigate to `http://localhost:8080/tests/test-runner.html`
3. Click "Run All Tests" or run individual test suites

### Individual Test Files
Each test file can be run independently:
- `visualizer-direction-test.js` - Visualizer direction tests
- `dropdown-ui-test.js` - Dropdown UI tests  
- `recipe-modification-test.js` - Recipe modification tests
- `integration-test.js` - Calculator integration tests

## Test Framework

The tests use a simple custom test framework that provides:
- Basic assertions (`assert`, `assertEqual`, `assertApproximatelyEqual`)
- Test organization and reporting
- Pass/fail status tracking
- Error handling and reporting

## Test Structure

Each test file follows this pattern:
```javascript
import { TestFramework } from './framework.js';

const test = new TestFramework();

test.test('Description of test', () => {
    // Test implementation
    test.assertEqual(actual, expected, 'Error message');
});

test.run();
```

## Mock Implementation

Since this is a frontend-only application without a build system, the tests use:
- Mock objects for complex calculator logic
- Simplified implementations for unit testing
- Browser DOM APIs for UI testing
- Integration tests with realistic scenarios

## Expected Results

All tests should pass, indicating:
- ✓ New visualizer direction works correctly
- ✓ Dropdown UI improvements are functional
- ✓ Recipe modifications are properly implemented
- ✓ Calculator produces accurate results

## Manual Testing

In addition to automated tests, manually verify:
1. Load the calculator in a browser
2. Navigate to the Visualize tab
3. Test all three direction options (Left to right, Right to left, Top to bottom)
4. Click on an item to open the dropdown and verify it takes up most of the screen
5. Calculate requirements for Advanced Circuits and verify the ingredient changes

## Coverage

These tests cover:
- Core functionality of new features
- Integration with existing calculator logic
- User interface improvements
- Edge cases and error conditions
- Performance considerations

Note: This is a lightweight testing approach suitable for a static web application. For larger projects, consider using established testing frameworks like Jest, Mocha, or Jasmine.