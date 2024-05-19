import passport from 'passport';
import jwt from 'jsonwebtoken';
import '../utils/passport.js';

export const userLogIn = async (req, res, next) => {
	passport.authenticate("user_login", async (err, user, info) => {
		try {
			if (err) {
				throw new Error(err);
			}
			if (!user) {
				throw new Error(info.message);
			}

			req.login(user, { session: false }, async (error) => {
				if (error) {
					console.log("User couldn't be logged in.");
					throw new Error(error);
				}
				const body = { _id: user._id,fullName:user._fullName};

				const token = jwt.sign({ user: body}, process.env.SECRET, {
					expiresIn: "24h",
				});

				return res.status(200).json({token});
			});
		} catch (error) {
			error.status = 401;
			return next(error);
		}
	})(req, res, next);
};