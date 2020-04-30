const mongoose = require("mongoose");
const _ = require("lodash");
const generateSlug = require("../utils/slugify");
// const sendEmail = require("../aws");

const { Schemna } = mongoose;

const mongoSchema = new Schemna({
    googleId: {
        type: String,
        require: true,
        unique: true,
    },
    googleToken: {
        access_token: String,
        refresh_token: String,
        token_type: String,
        expiry_date: Number,
    },
    createAt: {
        type: Date,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    displayName: String,
    avatarUrl: String,
    isGithubConnected: {
        type: Boolean,
        default: false,
    },
    githubAccessToken: {
        type: String,
    },
});

class UserClass {
    static publicFields() {
        return [
            'id',
            'displayName',
            'email',
            'avatarUrl',
            'isAdmin',
            'isGithubConnected',
        ];
    }

    static async signInOrSignUp({ googleId, email, googleToken, displayName, avatarUrl }) {
        const user = await this.findOne({ googleId }).select(UserClass.publicFields().join(' '));

        if (user) {
            let modifier = {};

            if (googleToken.accessToken) {
                modifier.access_token = googleToken.accessToken;
            }

            if (googleToken.refreshToken) {
                modifier.refresh_token = googleToken.refreshToken;
            }

            if (_.isEmpty(modifier)) {
                return user;
            }

            await this.updateOne({ googleId }, { $set: modifier });

            return user;
        }

        const slug = await generateSlug(this, displayName);
        const userCount = await this.find().countDocuments();

        const newUser = await this.create({
            createAt: new Date(),
            googleId,
            email,
            googleToken,
            displayName,
            avatarUrl,
            slug,
            isAdmin: userCount === 0,
        });

        return _.pick(newUser, UserClass.publicFields());
    }
}

mongoSchema.loadClass(UserClass);

const User = mongoose.model("User", mongoSchema);
module.exports = User;

