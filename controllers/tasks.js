const initializeBoard = async (userId) => {
  try {
    //I will set the id of the board to the userId
    const board = await TaskModel.create({
      _id: userId,
      columns: [
        {
          id: 0,
          name: "To do",
          cards: [],
        },
        {
          id: 1,
          name: "In progress",
          cards: [],
        },
        {
          id: 2,
          name: "Under review",
          cards: [],
        },
        {
          id: 3,
          name: "Finished",
          cards: [],
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};
const getBoard = async (req, res) => {
  const user_id = req.params.id;
  const query = {
    _id: user_id,
  };
  const board = await TaskModel.findOne(query);
  if (!board) res.status(404).send("Not found");
  res.status(200).json(board);
};
const createCard = async (req, res) => {
  try {
    const {
      user_id,
      statusId,
      priorityId,
      title,
      details,
      deadline,
      createdAt,
    } = req.body;
    const query = {
      _id: user_id,
      "columns.id": statusId,
    };
    const update = {
      $push: {
        "columns.$.cards": {
          title,
          details,
          deadline,
          priority: priorityId,
          createdAt,
        },
      },
    };
    const result = await TaskModel.findOneAndUpdate(query, update, {
      new: true,
    });
    if (!result) {
      res.status(400).json({
        error: "Board not found or column",
      });
      return;
    }
    const newlyCreatedCard = result.columns
      .find((column) => column.id === statusId)
      .cards.pop();
    res.json(newlyCreatedCard);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const reorderCard = async (req, res) => {
  try {
    const { boardId, columnId, fromIndex, toIndex } = req.body;
    const board = await TaskModel.findOne({
      _id: boardId,
      "columns.id": columnId,
    });

    if (!board) {
      throw "Board or column not found";
      return;
    }

    const column = board.columns.find((col) => col.id == columnId);
    if (!column) {
      throw "Column not found";
      return;
    }
    const [card] = column.cards.splice(fromIndex, 1);

    if (!card) {
      throw "Card not found";
      return;
    }

    // Insert the card at the new position
    column.cards.splice(toIndex, 0, card);

    // Save the updated board
    await board.save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).send(error);
  }
};
const moveCard = async (req, res) => {
  const {
    boardId,
    sourceColumnId,
    destinationColumnId,
    cardIndex,
    destinationIndex,
  } = req.body;
  try {
    const board = await TaskModel.findOne({ _id: boardId });
    if (!board) {
      throw "Board not found";
    }
    const sourceColumn = board.columns.find((col) => col.id == sourceColumnId);
    if (!sourceColumn) {
      throw "Source column not found";
    }
    const destinationColumn = board.columns.find(
      (col) => col.id == destinationColumnId
    );
    if (!destinationColumn) {
      throw "Destination column not found";
    }
    const [card] = sourceColumn.cards.splice(cardIndex, 1);
    if (!card) {
      throw "Card not found in source column";
    }
    destinationColumn.cards.splice(destinationIndex, 0, card);
    // const card = sourceColumn.cards.splice(cardIndex, 1)[0];
    // destinationColumn.cards.splice(destinationIndex, 0, card);
    await board.save();
    res.json({ message: "Success" });
  } catch (error) {
    res.status(500).send(error);
  }
};
const editCard = async (req, res) => {
  const { boardId, oldStatus, newStatus, index, item } = req.body;
  try {
    const board = await TaskModel.findOne({ _id: boardId });
    if (!board) {
      throw "Board not found";
    }
    const column = board.columns.find((col) => col.id == oldStatus);
    if (!column) {
      throw "Column not found";
    }
    if (oldStatus == newStatus) {
      //Update the details from item
      const card = column.cards[index];
      card.title = item.title;
      card.details = item.details;
      card.priority = item.priority;
      card.deadline = item.deadline;
      await board.save();
    } else {
      const [card] = column.cards.splice(index, 1);
      if (!card) {
        throw "Card not found in column";
      }
      const newColumn = board.columns.find((col) => col.id == newStatus);
      if (!newColumn) {
        throw "Column not found";
      }
      //change the properties of card here
      card.title = item.title;
      card.details = item.details;
      card.priority = item.priority;
      card.deadline = item.deadline;
      newColumn.cards.splice(newColumn.cards.length, 0, card);
      await board.save();
    }
    res.json({ message: "Success" });
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteCard = async (req, res) => {
  const { boardId, status, index } = req.body;
  try {
    const board = await TaskModel.findOne({ _id: boardId });
    if (!board) {
      throw "Board not found";
    }
    const column = board.columns.find((col) => col.id == status);
    if (!column) {
      throw "Column not found";
    }
    if (index < 0 || index >= column.cards.length) {
      throw { message: "Index out of range" };
    }
    column.cards.splice(index, 1);
    await board.save();
    res.json({ message: "Success" });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  initializeBoard,
  deleteCard,
  getBoard,
  createCard,
  moveCard,
  editCard,
  reorderCard,
};
