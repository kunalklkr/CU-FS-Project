require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    logger.info('Cleared existing data');

    // Create users
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'Admin'
    });

    const editor1 = await User.create({
      email: 'editor1@example.com',
      password: 'editor123',
      name: 'Editor One',
      role: 'Editor'
    });

    const editor2 = await User.create({
      email: 'editor2@example.com',
      password: 'editor123',
      name: 'Editor Two',
      role: 'Editor'
    });

    const viewer = await User.create({
      email: 'viewer@example.com',
      password: 'viewer123',
      name: 'Viewer User',
      role: 'Viewer'
    });

    logger.info('Created users');

    // Create posts with latest tech news
    const posts = [
      {
        title: 'AI Revolution: ChatGPT-5 Announced with Breakthrough Capabilities',
        content: 'OpenAI has unveiled ChatGPT-5, featuring unprecedented reasoning abilities and multimodal understanding. The new model demonstrates human-level performance across complex tasks, including advanced mathematics, scientific research, and creative problem-solving. Industry experts predict this will accelerate AI adoption across healthcare, education, and enterprise sectors.',
        author: admin._id,
        status: 'published',
        tags: []
      },
      {
        title: 'Quantum Computing Breakthrough: Google Achieves Quantum Supremacy 2.0',
        content: 'Google\'s latest quantum processor, Willow, has achieved a milestone by solving problems in seconds that would take classical supercomputers millions of years. This advancement brings us closer to practical quantum computing applications in drug discovery, cryptography, and climate modeling. The tech community is calling this a pivotal moment in computing history.',
        author: editor1._id,
        status: 'published',
        tags: []
      },
      {
        title: 'Apple Vision Pro 2: The Future of Spatial Computing',
        content: 'Apple has announced the second generation of Vision Pro, featuring improved resolution, lighter design, and enhanced hand tracking. The new device integrates seamlessly with the Apple ecosystem and introduces groundbreaking AR applications for productivity, entertainment, and collaboration. Pre-orders have already exceeded expectations, signaling strong market demand for spatial computing.',
        author: editor1._id,
        status: 'published',
        tags: []
      },
      {
        title: 'Tesla\'s Full Self-Driving Reaches Level 4 Autonomy',
        content: 'Tesla has achieved a major milestone with its Full Self-Driving (FSD) system reaching Level 4 autonomy in select cities. The system can now handle complex urban environments without human intervention, marking a significant step toward fully autonomous vehicles. Regulatory approval is pending in multiple jurisdictions as the technology continues to evolve.',
        author: editor2._id,
        status: 'published',
        tags: []
      },
      {
        title: 'Web3 Renaissance: Ethereum 3.0 Launches with Revolutionary Scalability',
        content: 'The Ethereum network has successfully upgraded to version 3.0, introducing sharding and advanced layer-2 solutions that increase transaction throughput by 100x while reducing fees by 99%. This upgrade positions Ethereum as the leading platform for decentralized applications, DeFi, and NFTs. Developers are already migrating projects to take advantage of the enhanced capabilities.',
        author: admin._id,
        status: 'published',
        tags: []
      },
      {
        title: 'SpaceX Starship Successfully Completes First Mars Mission',
        content: 'SpaceX\'s Starship has successfully completed its first crewed mission to Mars, landing safely on the Red Planet after a six-month journey. The mission marks humanity\'s first steps toward becoming a multi-planetary species. The crew will spend 18 months conducting research and establishing infrastructure for future missions.',
        author: editor2._id,
        status: 'published',
        tags: []
      },
      {
        title: 'Breakthrough in Fusion Energy: First Commercial Reactor Goes Online',
        content: 'The world\'s first commercial fusion reactor has begun operations, producing clean, unlimited energy without radioactive waste. This breakthrough could revolutionize global energy production and accelerate the transition away from fossil fuels. Scientists estimate that fusion power could meet 50% of global energy demand within the next decade.',
        author: admin._id,
        status: 'published',
        tags: []
      },
      {
        title: 'Neural Interface Technology: Neuralink Enables Thought-to-Text Communication',
        content: 'Neuralink has achieved a breakthrough in brain-computer interface technology, enabling users to compose text and control devices using only their thoughts. The technology has shown remarkable success in clinical trials, offering hope for individuals with paralysis and neurological conditions. The company plans to expand trials and pursue FDA approval for wider deployment.',
        author: editor1._id,
        status: 'published',
        tags: []
      }
    ];

    await Post.insertMany(posts);
    logger.info('Created posts');

    console.log('\n=== Seed Data Created Successfully ===\n');
    console.log('Admin Account:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    console.log('  Role: Admin\n');
    
    console.log('Editor Accounts:');
    console.log('  Email: editor1@example.com');
    console.log('  Password: editor123');
    console.log('  Role: Editor\n');
    
    console.log('  Email: editor2@example.com');
    console.log('  Password: editor123');
    console.log('  Role: Editor\n');
    
    console.log('Viewer Account:');
    console.log('  Email: viewer@example.com');
    console.log('  Password: viewer123');
    console.log('  Role: Viewer\n');

    process.exit(0);
  } catch (error) {
    logger.error('Seed error', { error: error.message });
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedData();
