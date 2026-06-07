require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../models/usersModel');

const url = process.env.MONGO_URL;
if (!url) {
    console.error('MONGO_URL not set in .env');
    process.exit(1);
}

const doDelete = process.argv.includes('--delete');

async function main() {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('connected to db');

    const query = { $or: [{ email: null }, { email: { $exists: false } }] };
    const docs = await userModel.find(query).lean();

    if (!docs.length) {
        console.log('No users found with null or missing email.');
        await mongoose.disconnect();
        return process.exit(0);
    }

    console.log(`Found ${docs.length} user(s) with null/missing email:`);
    docs.forEach(d => console.log(JSON.stringify({ _id: d._id, email: d.email, username: d.username }, null, 2)));

    if (!doDelete) {
        console.log('\nRun this script again with --delete to remove these documents.');
        await mongoose.disconnect();
        return process.exit(0);
    }

    const ids = docs.map(d => d._id);
    const res = await userModel.deleteMany({ _id: { $in: ids } });
    console.log(`Deleted ${res.deletedCount} document(s).`);
    await mongoose.disconnect();
    return process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
