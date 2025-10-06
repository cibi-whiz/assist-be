import { Injectable } from '@nestjs/common';
const { MongoClient } = require("mongodb");

@Injectable()
export class JsonStorageService {

    constructor() { }

    async addJsonDocument(payload: Record<string, any>) {
        const mongoUrl = process.env.MONGODB_URL;
        const dbName = process.env.MONGODB_DB_NAME;
        const collectionName = process.env.MONGODB_COLLECTION_NAME;

        const client = new MongoClient(mongoUrl);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.updateOne({ _id: payload._id }, { $set: payload }, { upsert: true });
        await client.close();

        return result;
    }

    async getJsonDocument(id: string) {
        const mongoUrl = process.env.MONGODB_URL;
        const dbName = process.env.MONGODB_DB_NAME;
        const collectionName = process.env.MONGODB_COLLECTION_NAME;

        const client = new MongoClient(mongoUrl);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const document = await collection.findOne({ _id: id });
        await client.close();

        return document;
    }
}
