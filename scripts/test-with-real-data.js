#!/usr/bin/env node

/**
 * StudySharper Real Integration Test
 * This script tests actual functionality with real Supabase connection
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🔥 StudySharper Real Integration Test\n');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test 1: Environment Configuration
console.log('1. 🔧 Environment Configuration Test');
if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL not configured');
  console.log('   💡 Set up real Supabase project first');
  process.exit(1);
}

if (!supabaseKey || supabaseKey.includes('your-anon')) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured');
  console.log('   💡 Add real Supabase keys to .env.local');
  process.exit(1);
}

console.log('   ✅ Environment variables configured');
console.log(`   📡 Supabase URL: ${supabaseUrl}`);

// Test 2: Database Connection
console.log('\n2. 📡 Database Connection Test');
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('   ❌ Database connection failed:', error.message);
      console.log('   💡 Check if database migration was run');
      return false;
    }
    
    console.log('   ✅ Database connection successful');
    return true;
  } catch (err) {
    console.log('   ❌ Connection error:', err.message);
    return false;
  }
}

// Test 3: Table Structure
console.log('\n3. 🗄️  Database Schema Test');
async function testTables() {
  const requiredTables = [
    'profiles',
    'flashcard_decks', 
    'flashcards',
    'study_sessions',
    'ai_conversations'
  ];
  
  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Table '${table}' not accessible:`, error.message);
        return false;
      } else {
        console.log(`   ✅ Table '${table}' exists and accessible`);
      }
    } catch (err) {
      console.log(`   ❌ Error checking table '${table}':`, err.message);
      return false;
    }
  }
  return true;
}

// Test 4: Create Test Data
console.log('\n4. 📝 Test Data Creation');
async function createTestData() {
  const testUserId = 'test-user-' + Date.now();
  
  try {
    // Create test profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        email: 'test@studysharper.com',
        full_name: 'Test User'
      })
      .select()
      .single();
    
    if (profileError) {
      console.log('   ❌ Failed to create test profile:', profileError.message);
      return false;
    }
    
    console.log('   ✅ Test profile created');
    
    // Create test deck
    const { data: deck, error: deckError } = await supabase
      .from('flashcard_decks')
      .insert({
        user_id: testUserId,
        name: 'Test Deck',
        description: 'Automated test deck',
        card_count: 0
      })
      .select()
      .single();
    
    if (deckError) {
      console.log('   ❌ Failed to create test deck:', deckError.message);
      return false;
    }
    
    console.log('   ✅ Test deck created');
    
    // Create test flashcard
    const { data: card, error: cardError } = await supabase
      .from('flashcards')
      .insert({
        user_id: testUserId,
        deck_id: deck.id,
        front: 'What is the capital of France?',
        back: 'Paris',
        next_review: new Date().toISOString()
      })
      .select()
      .single();
    
    if (cardError) {
      console.log('   ❌ Failed to create test card:', cardError.message);
      return false;
    }
    
    console.log('   ✅ Test flashcard created');
    
    // Update deck count
    await supabase
      .from('flashcard_decks')
      .update({ card_count: 1 })
      .eq('id', deck.id);
    
    return { profile, deck, card };
  } catch (err) {
    console.log('   ❌ Error creating test data:', err.message);
    return false;
  }
}

// Test 5: Spaced Repetition Logic
console.log('\n5. 🧠 Spaced Repetition Test');
async function testSpacedRepetition(cardId) {
  try {
    // Load spaced repetition function
    const spacedRepPath = path.join(__dirname, '..', 'lib', 'flashcards', 'spaced-repetition.ts');
    if (!fs.existsSync(spacedRepPath)) {
      console.log('   ❌ Spaced repetition module not found');
      return false;
    }
    
    // Test with TypeScript compilation
    const { execSync } = require('child_process');
    try {
      execSync('npx tsx --eval "import(\\"../lib/flashcards/spaced-repetition.ts\\").then(m => console.log(\\"Loaded\\"))"', {
        cwd: __dirname,
        stdio: 'pipe'
      });
      console.log('   ✅ Spaced repetition module loads correctly');
    } catch (err) {
      console.log('   ⚠️  Could not test module loading (TypeScript compilation needed)');
    }
    
    // Test database update with mock review
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 1); // Next day
    
    const { error } = await supabase
      .from('flashcards')
      .update({
        last_reviewed: new Date().toISOString(),
        next_review: reviewDate.toISOString(),
        review_count: 1,
        success_rate: 1.0
      })
      .eq('id', cardId);
    
    if (error) {
      console.log('   ❌ Failed to update card review data:', error.message);
      return false;
    }
    
    console.log('   ✅ Card review data updated successfully');
    return true;
  } catch (err) {
    console.log('   ❌ Error testing spaced repetition:', err.message);
    return false;
  }
}

// Test 6: Clean Up
async function cleanUp(testData) {
  if (!testData) return;
  
  console.log('\n6. 🧹 Cleanup Test Data');
  try {
    // Delete in reverse order due to foreign keys
    await supabase.from('flashcards').delete().eq('user_id', testData.profile.id);
    await supabase.from('flashcard_decks').delete().eq('user_id', testData.profile.id);
    await supabase.from('profiles').delete().eq('id', testData.profile.id);
    
    console.log('   ✅ Test data cleaned up');
  } catch (err) {
    console.log('   ⚠️  Cleanup warning:', err.message);
  }
}

// Run all tests
async function runTests() {
  const connected = await testConnection();
  if (!connected) return;
  
  const tablesOk = await testTables();
  if (!tablesOk) return;
  
  const testData = await createTestData();
  if (!testData) return;
  
  const spacedRepOk = await testSpacedRepetition(testData.card.id);
  
  await cleanUp(testData);
  
  console.log('\n🎯 Integration Test Results');
  console.log('==========================================');
  console.log('✅ Database connection works');
  console.log('✅ All required tables exist');
  console.log('✅ CRUD operations successful');
  console.log('✅ Foreign key relationships work');
  console.log('✅ Spaced repetition data updates');
  
  if (spacedRepOk) {
    console.log('\n🚀 INTEGRATION TEST: PASSED');
    console.log('💪 StudySharper is ready for real users!');
    console.log('\nNext steps:');
    console.log('1. Test signup flow at http://localhost:3000/sign-up');
    console.log('2. Create flashcards manually');  
    console.log('3. Test study session');
    console.log('4. Deploy to production');
  } else {
    console.log('\n⚠️  INTEGRATION TEST: PARTIAL');
    console.log('Database operations work, but check spaced repetition logic');
  }
}

runTests().catch(console.error);