const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", (req, res) => {
  // find all categories
  Category.findAll({
    include: {
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
    },
  })
    .then((dbCatData) => {
      if (!dbCatData) {
        res.status(404).json({ message: "No categories found" });
        return;
      }
      res.json(dbCatData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  try {
    const categoryByID = Category.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (categoryByID) {
      res.json(categoryByID);
    } else {
      res.status(404).json({ error: "No category by with this ID" });
    }
  } catch (error) {
    res.status(501).json(error);
  }
});

router.post("/", (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name,
  })
    .then((dbCatData) => res.json(dbCatData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((cat) => Category.findByPk(req.params.id))
    .then((updatedCategory) => res.status(200).json(updatedCategory))
    .catch((err) => {
      res.json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategory = Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedCategory) {
      res.json(deletedCategory);
    } else {
      res.status(404).json({ error: "No category with this ID" });
    }
  } catch (error) {
    res.status(503).json(error);
  }
});

module.exports = router;
