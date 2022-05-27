import * as express from 'express';
import { PrismaClient } from '@prisma/client'

const musicRouter = express.Router();

const prefix = '/api';

const prisma = new PrismaClient();

const SCHEMA = {
    institution: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
        isLength: {
            options: { min: 2, max: 255 },
            errorMessage: 'חובה להיות בין 2 ל-255 תווים'
        },
    },
    id_student: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
        isLength: {
            options: { min: 9, max: 9 },
            errorMessage: 'חובה להיות באורך 9 תווים!'
        },
        matches: {
            options: '[0-9]{9,9}',
            errorMessage: 'תעודת זהות מכיל רק מספרים',
        },
    },
    birthDate: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
    },
    firstName: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
        isLength: {
            options: { min: 2, max: 255 },
            errorMessage: 'חובה להיות בין 2 ל-255 תווים'
        },
    },
    lastName: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
        isLength: {
            options: { min: 2, max: 255 },
            errorMessage: 'חובה להיות בין 2 ל-255 תווים'
        },
    },
    birthCountry: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
    },
    gender: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
    },
    nation: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
        isLength: {
            options: { min: 2, max: 255 },
            errorMessage: 'חובה להיות בין 2 ל-255 תווים'
        },
    },
    homePhone: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
        isLength: {
            options: { min: 9, max: 9 },
            errorMessage: 'חובה להיות באורך 9 תווים!'
        },
    },
    mobilePhone: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: 'חובה להיות באורך 10 תווים!'
        },
    },
    email: {
        notEmpty: {
            errorMessage: "שדה חובה!"
        },
        isEmail: {
            errorMessage: "אימייל שגוי"
        },
    },
}

musicRouter.get(`${prefix}/create-all`, async (request: express.Request, response: express.Response) => {
    for(let i = 0; i < 10; i++) {
        const account = await prisma.account.create({
            data: {
                lastName: `yad${i}`,
                firstName: `ortal${i}`,
                isActive: Math.floor(Math.random() * 2) ? true : false,
            },
        })

        await prisma.collection.create({
            data: {
                title: `sing${i}`,
                countSongs: Math.floor(Math.random() * 10),
                accountId: account.id,
            },
        })

        await prisma.song.create({
            data: {
                name: `sing${i}`,
                rate: Math.floor(Math.random() * 1000),
                duration: '2:30',
            },
        })
    }

    const songLength = await prisma.song.count();
    const collectionLength = await prisma.collection.count();

    for(let i = 0; i < 5; i++) {
        const songIndex = Math.floor(Math.random() * songLength - 1) + 1;
        const collectionIndex = Math.floor(Math.random() * collectionLength - 1) + 1;

        await prisma.song.update({
            where: {
              id: 1,
            },
            data: {
                collections: {
                    connect: {
                        id: Number(1),
                    },
                },
            },
        })
        await prisma.collection.update({
            where: {
                id: 1,
            },
            data: {
                songs: {
                    connect: {
                        id: 1,
                    },
                },
            },
        })
    }
});

musicRouter.get(`${prefix}/collections`, async (request: express.Request, response: express.Response) => {
    const params = request.query;

    if(!params.id) {
        return response.status(422).json({ errors: 'Need account id' });
    }

    const collections = await prisma.collection.findMany({
        where: {
            accountId: Number(params.id),
        },
    });

    response.status(200).send(collections);
});

musicRouter.get(`${prefix}/empty-collections`, async (request: express.Request, response: express.Response) => {
    const collections = await prisma.collection.findMany({
        where: {
            countSongs: 0,
        },
    });

    response.status(200).send(collections);
});

musicRouter.get(`${prefix}/accounts`, async (request: express.Request, response: express.Response) => {
    const users = await prisma.account.findMany({
        where: {
            isActive: true,
        },
    });

    response.status(200).send(users);
});

musicRouter.get(`${prefix}/collection/songs`, async (request: express.Request, response: express.Response) => {
    const params = request.query;

    if(!params.id) {
        return response.status(422).json({ errors: 'Need account id' });
    }

    const collections = await prisma.collection.findMany({
        where: {
            id: Number(params.id),
        },
        include: {
            songs: true,
        },
    })

    const songs = collections.map(collection => collection.songs)

    response.status(200).send(songs);
});

musicRouter.get(`${prefix}/song/collections`, async (request: express.Request, response: express.Response) => {
    const params = request.query;

    if(!params.id) {
        return response.status(422).json({ errors: 'Need account id' });
    }

    const songs = await prisma.song.findMany({
        where: {
            id: Number(params.id),
        },
        include: {
            collections: true,
        },
    })

    const collections = songs.map(song => song.collections)

    response.status(200).send(collections);
});

musicRouter.get(`${prefix}/accounts/songs`, async (request: express.Request, response: express.Response) => {
    const params = request.query;

    if(!params.id) {
        return response.status(422).json({ errors: 'Need account id' });
    }

    const collections = await prisma.collection.findMany({
        where: {
            accountId: Number(params.id),
        },
        include: {
            songs: true,
        },
    })

    const songs = collections.map(collection => collection.songs)

    response.status(200).send(songs);
});

musicRouter.get(`${prefix}/songs/`, async (request: express.Request, response: express.Response) => {
    const params = request.query;

    if(!params.id) {
        return response.status(422).json({ errors: 'Need account id' });
    }

    const songs = await prisma.song.findMany({
        where: {
            id: Number(params.id),
        },
        include: {
            collections:
                {
                    select: {
                        title: true,
                    },
                },
        },
    })

    response.status(200).send(songs);
});

export default musicRouter;