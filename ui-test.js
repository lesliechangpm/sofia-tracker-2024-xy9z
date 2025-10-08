const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function analyzeUI() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set different viewport sizes
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'wide', width: 1920, height: 1080 }
  ];
  
  const analysis = {
    timestamp: new Date().toISOString(),
    viewports: [],
    metrics: {}
  };

  for (const viewport of viewports) {
    await page.setViewport(viewport);
    await page.goto('http://localhost:3007/sofia-tracker-2024-xy9z', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: `screenshots/ui-analysis-${viewport.name}.png`,
      fullPage: true 
    });
    
    // Analyze the page
    const pageAnalysis = await page.evaluate(() => {
      const getElementInfo = (selector) => {
        const elem = document.querySelector(selector);
        if (!elem) return null;
        const rect = elem.getBoundingClientRect();
        const styles = window.getComputedStyle(elem);
        return {
          width: rect.width,
          height: rect.height,
          padding: styles.padding,
          margin: styles.margin,
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
          color: styles.color,
          backgroundColor: styles.backgroundColor
        };
      };
      
      // Analyze spacing issues
      const cards = Array.from(document.querySelectorAll('.card')).map(card => {
        const rect = card.getBoundingClientRect();
        const styles = window.getComputedStyle(card);
        return {
          width: rect.width,
          height: rect.height,
          padding: styles.padding,
          margin: styles.margin
        };
      });
      
      // Check text readability
      const textElements = Array.from(document.querySelectorAll('p, span, h1, h2, h3')).map(elem => {
        const styles = window.getComputedStyle(elem);
        return {
          tag: elem.tagName,
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
          color: styles.color
        };
      });
      
      // Check button sizes for mobile
      const buttons = Array.from(document.querySelectorAll('button')).map(btn => {
        const rect = btn.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          text: btn.textContent.trim()
        };
      });
      
      return {
        header: getElementInfo('header'),
        mainContent: getElementInfo('main'),
        cards,
        textElements: textElements.slice(0, 10), // Sample
        buttons,
        bodyStyles: {
          fontFamily: window.getComputedStyle(document.body).fontFamily,
          backgroundColor: window.getComputedStyle(document.body).backgroundColor
        }
      };
    });
    
    analysis.viewports.push({
      ...viewport,
      analysis: pageAnalysis
    });
  }
  
  // Performance metrics
  await page.goto('http://localhost:3007/sofia-tracker-2024-xy9z', { 
    waitUntil: 'networkidle2' 
  });
  
  const metrics = await page.evaluate(() => {
    return {
      documentHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      totalElements: document.querySelectorAll('*').length,
      images: document.images.length,
      buttons: document.querySelectorAll('button').length,
      inputs: document.querySelectorAll('input, textarea, select').length
    };
  });
  
  analysis.metrics = metrics;
  
  // Save analysis
  await fs.writeFile(
    'ui-analysis.json', 
    JSON.stringify(analysis, null, 2)
  );
  
  console.log('UI Analysis complete. Check ui-analysis.json and screenshots/');
  
  await browser.close();
  
  return analysis;
}

// Run the analysis
analyzeUI().catch(console.error);