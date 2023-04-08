const express = require("express");
const userModel = require("../models/user.model");
const ledgerModel = require("../models/ledger.model");

const userRouter = express.Router();

userRouter.post("/openaccount", async (req, res, next) => {
  let details = req.body;
  const { email, pan, balance } = details;
  try {
    const users = await userModel.find({ email, pan });
    if (users.length > 0) {
      res.send("exists");
    } else {
      try {
        let user = new userModel({ ...details });
        await user.save();
        try {
          let statement = new ledgerModel({
            email,
            pan,
            desc: "Added Opening Balance",
            trans: "credit",
            balance,
          });
          await statement.save();
          res.send("registered");
        } catch (err) {
          next(err);
        }
      } catch (err) {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
});

userRouter.get("/getuser", async (req, res, next) => {
  const { email, pan } = req.query;
  try {
    let users = await userModel.find({ email, pan });
    res.send(users[0]);
  } catch (err) {
    next(err);
  }
});

userRouter.patch("/updatekyc/:id", async (req, res, next) => {
  const { id } = req.params;
  const details = req.body;
  try {
    await userModel.findByIdAndUpdate(id, details);
    res.send("Data Updated Successfully");
  } catch (err) {
    next(err);
  }
});

userRouter.patch("/deposit/:id", async (req, res, next) => {
  const { id } = req.params;
  const { add, email, pan } = req.body;
  try {
    let ans = await userModel.findById(id);
    let sum = ans.balance + add;
    await userModel.findByIdAndUpdate(id, { balance: sum });
    try {
      let statement = new ledgerModel({
        email,
        pan,
        id,
        desc: "Money Deposit",
        trans: "credit",
        balance: sum,
        amount: add,
      });
      await statement.save();
      res.send("deposited");
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

userRouter.patch("/withdraw/:id", async (req, res, next) => {
  const { id } = req.params;
  const { add, email, pan } = req.body;
  try {
    let ans = await userModel.findById(id);
    let sum = ans.balance - add || 0;
    await userModel.findByIdAndUpdate(id, { balance: sum });
    try {
      let statement = new ledgerModel({
        email,
        pan,
        id,
        desc: "Money Withdrawal",
        trans: "debit",
        balance: sum,
        amount: add,
      });
      await statement.save();
      res.send("withdrawed");
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

userRouter.patch("/transfer/:id", async (req, res, next) => {
  const { id } = req.params;
  const { add, email, pan, temail, tpan } = req.body;

  try {
    let ans = await userModel.findById(id);
    try {
      let rec = await userModel.find({ email: temail, pan: tpan });
      if (rec.length == 0) {
        res.send("User Does Not Exist");
      } else {
        let sum = ans.balance - add || 0;
        await userModel.findByIdAndUpdate(id, { balance: sum });
        try {
          let statement = new ledgerModel({
            email,
            pan,
            id,
            desc: `Money transferred to ${email}`,
            trans: "debit",
            balance: sum,
            amount: add,
          });
          await statement.save();
          res.send("transferred");
        } catch (err) {
          next(err);
        }

        try {
          let sum2 = rec[0].balance + add;
          await userModel.findByIdAndUpdate(rec[0]._id, { balance: sum2 });
          try {
            let statement = new ledgerModel({
              email: temail,
              pan: tpan,
              id: rec[0]._id,
              desc: "Money deposit",
              trans: "credit",
              balance: sum2,
              amount: add,
            });
            await statement.save();
            res.send("Deposited");
          } catch (err) {
            next(err);
          }
        } catch (err) {
          next(err);
        }
      }
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

userRouter.get("/print/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    let data = await ledgerModel.find({ id });
    res.send(data);
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await userModel.findByIdAndDelete(id);
    res.send("User Deleted successfully");
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
