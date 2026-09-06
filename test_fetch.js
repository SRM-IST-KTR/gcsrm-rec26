const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  let fetchUrl = null;
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/recruitment')) {
      fetchUrl = url;
      console.log('Intercepted fetch URL:', url);
    }
  });

  await page.goto('http://localhost:3000');
  
  // Wait a bit for client-side logic to run
  await new Promise(r => setTimeout(r, 2000));
  
  // If we need to set context, we can evaluate a script to set localStorage/sessionStorage
  // or context state. The context might need `participant.email` and `status: "task_assigned"`
  // Let's see if we can trigger it.
  
  await browser.close();
  
  if (fetchUrl) {
    if (fetchUrl.includes('localhost:5000')) {
      console.error('FAILED: Fetch went to port 5000');
      process.exit(1);
    } else {
      console.log('SUCCESS: Fetch url is', fetchUrl);
      process.exit(0);
    }
  } else {
    console.log('WARNING: No fetch to /api/recruitment intercepted. We might need to mock auth state.');
  }
})();
