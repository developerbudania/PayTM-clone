import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middlewares.js";
import { Account } from "../db.js";
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });
    res.json({
        balance: account.balance
    })
});

// simpler method but there will be errors in this if we proceed like this

// router.post("/transfer", authMiddleware, async (req, res) => {
//     const { amount, to } = req.body;
//     const account = await Account.findOne({
//         userId: req.userId
//     });
//     if (account.balance < amount) {
//         return res.status(403).json({
//             message: "Insufficient balance"
//         })
//     }
//     const toAccount = await Account.findOne({
//         userId: to
//     });
//     if (!toAccount) {
//         return res.status(403).json({
//             message: "Invalid account"
//         })
//     }
//     await Account.updateOne({
//         userId: req.userId
//     }, {
//         $inc: {
//             balance: -amount
//         }
//     })
//     await Account.updateOne({
//         userId: to
//     }, {
//         $inc: {
//             balance: +amount
//         }
//     })
//     res.json({
//         meddage: "Transfer successful"
//     })

// });


router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    if (to === req.userId) {
        await session.abortTransaction();
        return res.json({
            success: false,
            message: "Cannot transfer to yourself!"
        })
    }

    const account = await Account.findOne({ userId: req.userId }).session(session);
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(211).json({
            success: false,
            message: "Insufficient balance"
        });
    }
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(211).json({
            success: false,
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: +amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        success: true,
        message: "Transfer successful"
    });

});


export { router as accountRouter };