const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const runTests = async () => {
  console.log('🧪 Starting API Verification Tests...');
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  let token = '';

  try {
    // 1. Register User
    console.log('\n--- Test 1: Register User ---');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: testEmail,
        password: testPassword
      })
    });
    const registerData = await registerRes.json();
    console.log('Status:', registerRes.status);
    if (registerRes.status === 201 && registerData.token) {
      console.log('✅ Registration Passed!');
      token = registerData.token;
    } else {
      throw new Error(`Registration Failed: ${JSON.stringify(registerData)}`);
    }

    // 2. Login User
    console.log('\n--- Test 2: Login User ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json();
    console.log('Status:', loginRes.status);
    if (loginRes.status === 200 && loginData.token) {
      console.log('✅ Login Passed!');
    } else {
      throw new Error(`Login Failed: ${JSON.stringify(loginData)}`);
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 3. Get Topics
    console.log('\n--- Test 3: Get Topics ---');
    const topicsRes = await fetch(`${BASE_URL}/topics`, { headers });
    const topicsData = await topicsRes.json();
    console.log('Status:', topicsRes.status);
    console.log('Total Topics Found:', topicsData.length);
    if (topicsRes.status === 200 && topicsData.length > 0) {
      console.log('✅ Get Topics Passed!');
    } else {
      throw new Error('Get Topics Failed');
    }

    // 4. Get Dashboard Summary
    console.log('\n--- Test 4: Get Dashboard Summary ---');
    const dashRes = await fetch(`${BASE_URL}/dashboard`, { headers });
    const dashData = await dashRes.json();
    console.log('Status:', dashRes.status);
    console.log('Readiness Score:', dashData.readinessScore);
    console.log('Streak:', dashData.streak);
    if (dashRes.status === 200 && typeof dashData.readinessScore === 'number') {
      console.log('✅ Get Dashboard Passed!');
    } else {
      throw new Error('Get Dashboard Failed');
    }

    // 5. Get Recommendations
    console.log('\n--- Test 5: Get Recommendations ---');
    const recsRes = await fetch(`${BASE_URL}/recommendations`, { headers });
    const recsData = await recsRes.json();
    console.log('Status:', recsRes.status);
    console.log('Recommendations Count:', recsData.length);
    if (recsRes.status === 200 && recsData.length > 0) {
      console.log('✅ Get Recommendations Passed!');
    } else {
      throw new Error('Get Recommendations Failed');
    }

    // 6. Create Problem
    console.log('\n--- Test 6: Create Problem ---');
    const createProblemRes = await fetch(`${BASE_URL}/problems`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Merge Sort Implementation',
        difficulty: 'Medium',
        topic: 'Arrays',
        platform: 'LeetCode',
        timeTaken: 25,
        status: 'Solved',
        tags: ['Sorting', 'Divide and Conquer']
      })
    });
    const problemData = await createProblemRes.json();
    console.log('Status:', createProblemRes.status);
    console.log('Created Problem Title:', problemData.title);
    if (createProblemRes.status === 201 && problemData._id) {
      console.log('✅ Create Problem Passed!');
    } else {
      throw new Error('Create Problem Failed');
    }

    // 7. Recheck Dashboard after Problem Solved (Readiness should update)
    console.log('\n--- Test 7: Verify Readiness Recalculation ---');
    const postDashRes = await fetch(`${BASE_URL}/dashboard`, { headers });
    const postDashData = await postDashRes.json();
    console.log('New Readiness Score:', postDashData.readinessScore);
    console.log('Problems Solved count:', postDashData.problemsSolved.total);
    if (postDashRes.status === 200 && postDashData.problemsSolved.total === 1) {
      console.log('✅ Readiness Score Update Passed!');
    } else {
      throw new Error('Readiness Recalculation verification failed');
    }

    // 8. Create Mock Test
    console.log('\n--- Test 8: Generate Mock Test ---');
    const createMockRes = await fetch(`${BASE_URL}/mock-tests`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        company: 'Google',
        difficulty: 'Medium',
        duration: 60
      })
    });
    const mockData = await createMockRes.json();
    console.log('Status:', createMockRes.status);
    console.log('Generated Questions count:', mockData.questions.length);
    if (createMockRes.status === 201 && mockData._id) {
      console.log('✅ Generate Mock Test Passed!');
    } else {
      throw new Error('Generate Mock Test Failed');
    }

    // 9. Submit Mock Test
    console.log('\n--- Test 9: Submit Mock Test Answers ---');
    const submitMockRes = await fetch(`${BASE_URL}/mock-tests/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        testId: mockData._id,
        answers: {
          0: 'function myCode() { return true; }', // Coding question code
          1: mockData.questions[1].correctAnswer, // Correct MCQ
          2: 'Wrong Answer' // Incorrect MCQ
        }
      })
    });
    const submitMockData = await submitMockRes.json();
    console.log('Status:', submitMockRes.status);
    console.log('Graded Score:', submitMockData.score);
    console.log('Weak Areas Identified:', submitMockData.weakAreas);
    if (submitMockRes.status === 200 && submitMockData.completed === true) {
      console.log('✅ Submit Mock Test Passed!');
    } else {
      throw new Error('Submit Mock Test Failed');
    }

    // 10. Notes CRUD
    console.log('\n--- Test 10: Notes CRUD Operations ---');
    // Create Note
    const createNoteRes = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Graphs cheat sheet',
        category: 'DSA',
        content: '# Graphs Cheat Sheet\nUse BFS for shortest path in unweighted graphs.'
      })
    });
    const noteData = await createNoteRes.json();
    console.log('Create Note Status:', createNoteRes.status);
    if (createNoteRes.status !== 201) throw new Error('Create Note failed');

    // Update Note
    const updateNoteRes = await fetch(`${BASE_URL}/notes/${noteData._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        content: '# Graphs Cheat Sheet\nUse BFS for shortest path in unweighted graphs.\nUse Dijkstra for weighted graphs.'
      })
    });
    console.log('Update Note Status:', updateNoteRes.status);
    if (updateNoteRes.status !== 200) throw new Error('Update Note failed');

    // Delete Note
    const deleteNoteRes = await fetch(`${BASE_URL}/notes/${noteData._id}`, {
      method: 'DELETE',
      headers
    });
    console.log('Delete Note Status:', deleteNoteRes.status);
    if (deleteNoteRes.status === 200) {
      console.log('✅ Notes CRUD Passed!');
    } else {
      throw new Error('Delete Note failed');
    }

    console.log('\n🎉 ALL API VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
  }
};

runTests();
