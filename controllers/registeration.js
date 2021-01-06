const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs')
const {  API_KEY } = require('../config.js');
const User = require('../User.js')

exports.register  =  async (req,res, next)=>{
      const { username,email ,degree , exp,password: plainTextPassword , skills } = req.body
        let skillsArray = [];
      	if (!username) {
      		return res.json({ status: 'error', error: 'Invalid username' })
      	}
      	if (!plainTextPassword) {
      		return res.json({ status: 'error', error: 'Invalid password' })
      	}
        if (!degree) {
          return res.json({ status: 'error', error: 'Invalid Input' })
        }
        if (!exp) {
            exp = "0";
        }
        if(skills){
          console.log(/^[!#$%&'*+/=?^_`{|}~-]/.test(skills));
          if(/[!#$%&'*+/=?^_`{|}~-]/.test(skills)){
            return res.json({status : 'error' , error : 'please only use "," to separate values'})
          }
          skillsArray = skills.split(",").filter((skill)=>skill.trim() !== '' ).map((skill)=>skill.trim());
        }

        const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;



        if (!email || typeof email !== 'string' || !regEx.test(email)){
          return res.json({ status: 'error', error: 'Invalid email' })
        }

      	const password = await bcrypt.hash(plainTextPassword, 10)

      	try {
      		const response = new  User({
            username,
            email,
            degree,
            skills : skillsArray,
            experience : exp,
            password
          });

          sgMail.setApiKey(API_KEY);

          const html = `
          <div>
              <h1>Hey ${response.username} !</h1>
              <p>
                Congrantulations you have been successfully registered!
              </p>
          </div>
          `
          const message = {
            to : response.email,
            from:'manas.kalangan@gmail.com',
            subject : 'Inator',
            text : "You have Successfully registered",
            html
          };
          sgMail.send(message)
          .catch(err=>{
            res.json({status:'error' , error : "Something went wrong"})
            console.log(err)
          });
          await response.save();
          return res.json({status :'ok'});
      	} catch (error) {
      		if (error.code === 11000) {
            console.log(error);
      			return res.json({ status: 'error', error: 'Username already in use' })
      		}
      		throw error
      	}
}
