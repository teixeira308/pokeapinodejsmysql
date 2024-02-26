import validationResult from "express-validator";


class handleValidations {
    static validate = async (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
          return next();
        }
      
        const extractedErrors = [];
      
        errors.array().map((err) => extractedErrors.push(err.msg));
      
        return res.status(422).json({
          errors: extractedErrors,
        });
    }

}

export default handleValidations;
