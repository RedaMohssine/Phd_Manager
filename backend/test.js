const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash('admin', 10);
