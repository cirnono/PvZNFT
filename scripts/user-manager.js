const fs = require("fs")
const crypto = require("crypto")
const readline = require("readline")

const USERS_FILE = "user.json" // 用户数据存储的文件

// 创建接口用于读取用户输入
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// 辅助函数：加密密码
function encryptPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex") // 随机生成盐
    const hashedPassword = crypto.scryptSync(password, salt, 64).toString("hex") // 使用 scrypt 加密密码
    return { salt, hashedPassword }
}

// 辅助函数：验证密码
function verifyPassword(storedSalt, storedHashedPassword, inputPassword) {
    const hashedInputPassword = crypto
        .scryptSync(inputPassword, storedSalt, 64)
        .toString("hex")
    return storedHashedPassword === hashedInputPassword
}

// 检查用户是否存在
function getUser(username) {
    if (!fs.existsSync(USERS_FILE)) {
        return null
    }
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"))
    return users.find((user) => user.username === username)
}

// function used to add new user
// currently privateKey is stored as plain text, this will be inplemented to dock with user's wallet like metamesk
function addUser(username, password, walletAddress, privateKey) {
    const { salt, hashedPassword } = encryptPassword(password)
    const newUser = {
        username,
        passwordSalt: salt,
        passwordHash: hashedPassword,
        walletAddress,
        privateKey,
    }

    let users = []
    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"))
    }

    users.push(newUser)
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8")
}

// 登录验证
function login(username, password) {
    const user = getUser(username)
    if (!user) {
        console.log("User not found!")
        return false
    }

    const { passwordSalt, passwordHash } = user
    if (verifyPassword(passwordSalt, passwordHash, password)) {
        console.log(`Login successful! Wallet address: ${user.walletAddress}`)
        return user
    } else {
        console.log("Incorrect password!")
        return false
    }
}

// 用户注册流程
function register() {
    rl.question("Enter username: ", (username) => {
        if (getUser(username)) {
            console.log("Username already exists!")
            rl.close()
            return
        }

        rl.question("Enter password: ", (password) => {
            rl.question("Enter wallet address: ", (walletAddress) => {
                rl.question("Enter private key: ", (privateKey) => {
                    addUser(username, password, walletAddress, privateKey)
                    console.log("User registered successfully!")
                    rl.close()
                })
            })
        })
    })
}

// 用户登录流程
function loginUser() {
    rl.question("Enter username: ", (username) => {
        rl.question("Enter password: ", (password) => {
            const user = login(username, password)
            if (user) {
                // 这里你可以返回用户的数据，或者允许进行更多操作
            }
            rl.close()
        })
    })
}

// 主逻辑：选择注册或登录
function main() {
    rl.question("Are you a new user? (yes/no): ", (answer) => {
        if (answer.toLowerCase() === "yes") {
            register()
        } else {
            loginUser()
        }
    })
}

// 启动应用
main()
