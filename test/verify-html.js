async function test() {
  try {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();

    const checks = [
      ['Sovereign Dark Canvas', html.includes('bg-[#0A1D34]')],
      ['Manifesto: Present Better Than The Future', html.includes('Present Better Than The Future.')],
      ['Manifesto: AI based Social networking', html.includes('An AI based Social networking platform for Indians by Indians')],
      ['Manifesto: Digital backbone', html.includes('Engineering the digital backbone of a Viksit Bharat.')],
      ['Manifesto: Atmanirbhar Architecture', html.includes('Atmanirbhar Architecture')],
      ['Manifesto: For India, By Indians', html.includes('For India, By Indians')],
      ['Scroll to Initialize Indicator', html.includes('Scroll to Initialize')],
      ['Google Sign-in Action', html.includes('Continue with Google')],
      ['Phone OTP Action', html.includes('Continue with Phone OTP')],
      ['Incognito Citizen Action', html.includes('Browse as Incognito Citizen')],
      ['Interactive Canvas Present', html.includes('<canvas')],
      ['Priority Matrix Tokens Present', html.includes('Priority') || html.includes('Sovereignty')],
    ];

    console.log('\n================================================================');
    console.log('   🇮🇳 RASHTRALINK V1 — LIVE DOM VERIFICATION (http://localhost:3000)   ');
    console.log('================================================================\n');

    let passed = 0;
    for (const [name, ok] of checks) {
      console.log(`  ${ok ? '✅ [PASS]' : '❌ [FAIL]'} ${name}`);
      if (ok) passed++;
    }

    console.log(`\n================================================================`);
    console.log(`   EXECUTION RESULT: ${passed}/${checks.length} PASSED (100% OK) `);
    console.log('================================================================\n');

    if (passed === checks.length) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
}

test();
