const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('../src/config/database');
const Chemical = require('../src/models/Chemical');
const Reaction = require('../src/models/Reaction');
const Quiz = require('../src/models/Quiz');

const chemicals = require('./data/chemicals.json');
const reactions = require('./data/reactions.json');
const quizzes = require('./data/quizzes.json');

async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Chemical.deleteMany({});
    await Reaction.deleteMany({});
    await Quiz.deleteMany({});

    // Insert chemicals
    console.log('🧪 Inserting chemicals...');
    const insertedChemicals = await Chemical.insertMany(chemicals);
    console.log(`   ✅ ${insertedChemicals.length} chemicals inserted`);

    // Insert reactions
    console.log('⚗️  Inserting reactions...');
    const insertedReactions = await Reaction.insertMany(reactions);
    console.log(`   ✅ ${insertedReactions.length} reactions inserted`);

    // Insert quizzes
    console.log('📝 Inserting quizzes...');
    const insertedQuizzes = await Quiz.insertMany(quizzes);
    console.log(`   ✅ ${insertedQuizzes.length} quizzes inserted`);

    // Create text indexes
    console.log('📇 Creating indexes...');
    await Chemical.collection.createIndex({
      name: 'text',
      formula: 'text',
      category: 'text'
    });

    console.log('\n🎉 Seed completed successfully!');
    console.log(`   📊 Summary:`);
    console.log(`      Chemicals: ${insertedChemicals.length}`);
    console.log(`      Reactions: ${insertedReactions.length}`);
    console.log(`      Quizzes:   ${insertedQuizzes.length}`);

    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
