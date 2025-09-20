const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshots() {
  console.log('Starting visual testing with Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Define viewport sizes to test
    const viewports = [
      { name: 'desktop-lg', width: 1920, height: 1080 },
      { name: 'desktop', width: 1366, height: 768 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];

    // Create screenshots directory
    const fs = require('fs');
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    // Navigate to the app
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for the app to fully load
    await new Promise(r => setTimeout(r, 2000));

    // Capture screenshots at different viewport sizes
    for (const viewport of viewports) {
      console.log(`Capturing ${viewport.name} view (${viewport.width}x${viewport.height})...`);
      
      await page.setViewport({
        width: viewport.width,
        height: viewport.height
      });
      
      // Wait for any responsive changes
      await new Promise(r => setTimeout(r, 1000));
      
      // Capture full page screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, `${viewport.name}-full.png`),
        fullPage: true
      });
      
      // Capture above-the-fold screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, `${viewport.name}-fold.png`),
        fullPage: false
      });
    }

    // Analyze spacing and layout issues
    console.log('\nAnalyzing layout and spacing...\n');

    // Set to desktop view for analysis
    await page.setViewport({ width: 1366, height: 768 });

    // Check for overlapping elements
    const layoutIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check all card elements
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const styles = window.getComputedStyle(card);
        
        // Check padding
        const padding = {
          top: styles.paddingTop,
          right: styles.paddingRight,
          bottom: styles.paddingBottom,
          left: styles.paddingLeft
        };
        
        // Check margin
        const margin = {
          top: styles.marginTop,
          right: styles.marginRight,
          bottom: styles.marginBottom,
          left: styles.marginLeft
        };
        
        issues.push({
          element: `Card ${index + 1}`,
          width: rect.width,
          height: rect.height,
          padding: padding,
          margin: margin
        });
      });

      // Check main content areas
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const mainRect = mainContent.getBoundingClientRect();
        const mainStyles = window.getComputedStyle(mainContent);
        
        issues.push({
          element: 'Main Content',
          width: mainRect.width,
          padding: {
            top: mainStyles.paddingTop,
            right: mainStyles.paddingRight,
            bottom: mainStyles.paddingBottom,
            left: mainStyles.paddingLeft
          }
        });
      }

      // Check for text overflow
      const textElements = document.querySelectorAll('h1, h2, h3, p, span');
      textElements.forEach(el => {
        if (el.scrollWidth > el.clientWidth) {
          issues.push({
            element: 'Text Overflow',
            text: el.textContent.substring(0, 50),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth
          });
        }
      });

      return issues;
    });

    console.log('Layout Analysis Results:');
    console.log(JSON.stringify(layoutIssues, null, 2));

    // Check responsive grid behavior
    const gridAnalysis = await page.evaluate(() => {
      const gridContainer = document.querySelector('.grid');
      if (gridContainer) {
        const styles = window.getComputedStyle(gridContainer);
        return {
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
          gap: styles.gap,
          childCount: gridContainer.children.length
        };
      }
      return null;
    });

    if (gridAnalysis) {
      console.log('\nGrid Layout Analysis:');
      console.log(JSON.stringify(gridAnalysis, null, 2));
    }

    // Check for specific spacing issues
    const spacingIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check gap between sections
      const sections = document.querySelectorAll('.space-y-6 > *');
      sections.forEach((section, index) => {
        if (index > 0) {
          const prevSection = sections[index - 1];
          const prevRect = prevSection.getBoundingClientRect();
          const currentRect = section.getBoundingClientRect();
          const gap = currentRect.top - prevRect.bottom;
          
          if (gap < 20) {
            issues.push({
              type: 'Small gap between sections',
              gap: gap + 'px',
              between: `Section ${index} and ${index + 1}`
            });
          }
        }
      });

      // Check button spacing
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        const styles = window.getComputedStyle(btn);
        const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
        if (padding < 16) {
          issues.push({
            type: 'Button padding too small',
            element: btn.textContent,
            padding: padding + 'px'
          });
        }
      });

      return issues;
    });

    if (spacingIssues.length > 0) {
      console.log('\nSpacing Issues Found:');
      console.log(JSON.stringify(spacingIssues, null, 2));
    }

    console.log('\n✅ Visual testing complete! Screenshots saved to ./screenshots/');
    console.log('\nRecommended fixes based on analysis:');
    console.log('1. Check spacing between card components');
    console.log('2. Ensure consistent padding across all sections');
    console.log('3. Verify responsive grid behavior on different screen sizes');
    console.log('4. Review text overflow issues if any were found');

  } catch (error) {
    console.error('Error during visual testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the visual tests
captureScreenshots().catch(console.error);