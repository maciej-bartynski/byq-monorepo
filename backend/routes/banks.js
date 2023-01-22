const { ObjectId } = require("mongodb");
const {
  validateBank,
  castCreateReqBodyToBankObject,
  castUpdateReqBodyToBankObject,
} = require("../validators/bank");
const DbService = require("../services/DbService");

const postBank = async (req, res) => {
  const workspaceId = req.workspaceId;
  const newBank = castCreateReqBodyToBankObject(req.body, workspaceId);
  const errors = await validateBank(newBank);

  if (errors?.length) {
    res.status(400).json({
      message: "Bank not created",
      error: errors,
    });
  } else {
    DbService.banks.insertOne(newBank, (error, result) => {
      if (error || !result) {
        res.status(500).json({
          message: "Bank not created",
          error,
        });
      }

      res.status(200).json({
        message: "Bank created",
        data: result,
      });
    });
  }
};

const readBanks = async (req, res) => {
  const workspaceId = req.workspaceId;
  try {
    const banksCoursor = DbService.banks.find({
      workspaceId,
    });
    const banks = await banksCoursor.toArray();
    res.status(200).json({
      message: "Banks",
      data: banks,
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occured",
      error: err,
    });
  }
};

const editBank = async (req, res) => {
  const { bankId } = req.params;
  const workspaceId = req.workspaceId;
  if (
    bankId &&
    workspaceId &&
    (await checkIsBankPartOfWorkspace(bankId, workspaceId))
  ) {
    const bank = await DbService.banks.findOne({ _id: ObjectId(bankId) });
    const pocketPercentage =
      req.body.isPocket === false ? 0 : req.body.pocketPercentage;

    const updatedBank = castUpdateReqBodyToBankObject(
      {
        ...req.body,
        pocketPercentage,
      },
      bank
    );
    const errors = await validateBank(updatedBank);

    if (errors?.length) {
      res.status(400).json({
        message: "Bank not updated",
        error: errors,
      });
    } else {
      try {
        const result = await DbService.banks.updateOne(
          { _id: ObjectId(bankId) },
          {
            $set: updatedBank,
          }
        );

        res.status(200).json({
          message: "Bank changed successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          message: "Bank not changed",
          error,
        });
      }
    }
  } else {
    res.status(404).json({
      message:
        "Missing parameters: bankId or workspaceId, OR bank does not exist",
    });
  }
};

const checkIsBankPartOfWorkspace = async (bankId, workspaceId) => {
  try {
    const bank = await DbService.banks.findOne({ _id: ObjectId(bankId) });
    return bank.workspaceId === workspaceId;
  } catch {
    return false;
  }
};

const deleteBank = async (req, res) => {
  const { bankId } = req.params;
  const workspaceId = req.workspaceId;
  if (
    bankId &&
    workspaceId &&
    (await checkIsBankPartOfWorkspace(bankId, workspaceId))
  ) {
    try {
      const deletion = await DbService.banks.deleteOne({
        _id: ObjectId(bankId),
      });
      res.status(200).json({
        message: "Bank deleted",
        data: `Bank ${bankId} was deleted`,
        additional: deletion,
      });
    } catch (err) {
      res.status(500).json({
        message: "Bank deletion: an error ocurred",
        error: err,
      });
    }
  } else {
    res.status(404).json({
      message:
        "Missing parameters: bankId or workspaceId, OR bank does not exist",
    });
  }
};

const markBankAsPocket = async (req, res) => {
  const { bankId } = req.params;
  const workspaceId = req.workspaceId;
  if (
    bankId &&
    workspaceId &&
    (await checkIsBankPartOfWorkspace(bankId, workspaceId))
  ) {
    const bank = await DbService.banks.findOne({ _id: ObjectId(bankId) });

    const updatedBank = castUpdateReqBodyToBankObject(
      { pocketPercentage: 0, isPocket: true },
      bank
    );
    const errors = await validateBank(updatedBank);

    if (errors?.length) {
      res.status(400).json({
        message: "Bank not updated",
        error: errors,
      });
    } else {
      try {
        const result = await DbService.banks.updateOne(
          { _id: ObjectId(bankId) },
          {
            $set: updatedBank,
          }
        );

        res.status(200).json({
          message: "Bank changed successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          message: "Bank not changed",
          error,
        });
      }
    }
  } else {
    res.status(404).json({
      message:
        "Missing parameters: bankId or workspaceId, OR bank does not exist",
    });
  }
};

const unmarkBankAsPocket = async (req, res) => {
    const { bankId } = req.params;
    const workspaceId = req.workspaceId;
    if (
      bankId &&
      workspaceId &&
      (await checkIsBankPartOfWorkspace(bankId, workspaceId))
    ) {
      const bank = await DbService.banks.findOne({ _id: ObjectId(bankId) });
  
      const updatedBank = castUpdateReqBodyToBankObject(
        { pocketPercentage: 0, isPocket: false },
        bank
      );
      const errors = await validateBank(updatedBank);
  
      if (errors?.length) {
        res.status(400).json({
          message: "Bank not updated",
          error: errors,
        });
      } else {
        try {
          const result = await DbService.banks.updateOne(
            { _id: ObjectId(bankId) },
            {
              $set: updatedBank,
            }
          );
  
          res.status(200).json({
            message: "Bank changed successfully",
            data: result,
          });
        } catch (error) {
          res.status(500).json({
            message: "Bank not changed",
            error,
          });
        }
      }
    } else {
      res.status(404).json({
        message:
          "Missing parameters: bankId or workspaceId, OR bank does not exist",
      });
    }
  };

module.exports = {
  readBanks,
  postBank,
  editBank,
  deleteBank,
  markBankAsPocket,
  unmarkBankAsPocket
};
