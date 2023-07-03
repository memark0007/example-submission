
// User Model
const User = sequelize.define('User', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
})

// Item Model
const Item = sequelize.define('Item', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    productName: { type: Sequelize.STRING, allowNull: false },
    productDetail: { type: Sequelize.TEXT, allowNull: false },
    salePrice: { type: Sequelize.FLOAT, allowNull: false },
    openSaleDate: { type: Sequelize.DATE, allowNull: false },
    endSaleDate: { type: Sequelize.DATE, allowNull: false },
})

// Purchase Model
const Purchase = sequelize.define('Purchase', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: Sequelize.INTEGER, allowNull: false },
    itemId: { type: Sequelize.INTEGER, allowNull: false },
    purchaseDate: { type: Sequelize.DATE, allowNull: false },
    gameCode: { type: Sequelize.STRING, allowNull: false },
})

// Promotion Model
const Promotion = sequelize.define('Promotion', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    itemId: { type: Sequelize.INTEGER, allowNull: false },
    startDate: { type: Sequelize.DATE, allowNull: false },
    endDate: { type: Sequelize.DATE, allowNull: false },
    discountedPrice: { type: Sequelize.FLOAT, allowNull: false },
})

// Bundle Model
const Bundle = sequelize.define('Bundle', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    bundleName: { type: Sequelize.STRING, allowNull: false },
    bundlePrice: { type: Sequelize.FLOAT, allowNull: false },
})

// BundleItem Model
const BundleItem = sequelize.define('BundleItem', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    bundleId: { type: Sequelize.INTEGER, allowNull: false },
    itemId: { type: Sequelize.INTEGER, allowNull: false },
})

User.hasMany(Purchase, { foreignKey: 'userId' })
Purchase.belongsTo(User, { foreignKey: 'userId' })

Item.hasMany(Purchase, { foreignKey: 'itemId' })
Purchase.belongsTo(Item, { foreignKey: 'itemId' })

Item.hasOne(Promotion, { foreignKey: 'itemId' })
Promotion.belongsTo(Item, { foreignKey: 'itemId' })

Bundle.belongsToMany(Item, { through: 'BundleItem', foreignKey: 'bundleId' })
Item.belongsToMany(Bundle, { through: 'BundleItem', foreignKey: 'itemId' })
