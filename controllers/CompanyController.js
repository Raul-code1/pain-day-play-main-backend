const path= require('path');
const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");
const Company = require("../models/Company");

//*only admin can create,update,delete and upload image a company
const createCompany = async (req, res) => {
  req.body.user = req.user.userId;
  const company = await Company.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ msg: "Instalacion creada", company });
};

const getAllCompanies = async (req, res) => {
  const { category, sort } = req.query;
  const companies = await Company.find({ category })
    .select("_id name location pricing image")
    .sort(`${sort}.price`);
  res.status(StatusCodes.OK).json({ companies, count: companies.length });
};

const getSingleCompay = async (req, res) => {
  const { id } = req.params;
  const company = await Company.findOne({ _id: id }).populate('comments')
  if (!company)
    throw new CustomError.NotFoundError(
      `No hay ninguna isntalacion con el id ${id}`
    );
  res.status(StatusCodes.OK).json({ company });
};

const updateCompany = async (req, res) => {
  const {
    name,
    location,
    description,
    category,
    pricing,
    image,
    contactPhone,
    website,
  } = req.body;
  const { id } = req.params;

  if (
    !name ||
    !location ||
    !description ||
    !category ||
    !pricing ||
    !contactPhone ||
    !website
  ) {
    throw new CustomError.BadRequestError("Por favor rellena todos los campos");
  }

  const company = await Company.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!company)
    throw new CustomError.NotFoundError(
      `No se encontro ninguna elemento con el id ${id}`
    );

  res
    .status(StatusCodes.OK)
    .json({ msg: "Actualizado correctamente", company });
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;
  const company = await Company.findOne({ _id: id });
  if (!company)
    throw new CustomError.NotFoundError(
      `No se encontro ninguna elemento con el id ${id}`
    );
  await company.remove();
  res.status(StatusCodes.OK).json({ msg: "Eliminado correctamente" });
};

const uploadImage = async (req, res) => {
  if (!req.files)
    throw new CustomError.BadRequestError("Por favor selecciona un archivo");

  const companyImage = req.files.image;
  if (!companyImage.mimetype.startsWith("image"))
    throw new CustomError.BadRequestError("Por favor selecciona un archivo");
    
    const maxSize= 1024 * 1024;
    if (companyImage.size > maxSize)throw new CustomError.BadRequestError("Por favor selecciona un archivo mas pequeño");
        
    const imagePath= path.join(__dirname,'../public/uploads/'+`${companyImage.name}`)

    await companyImage.mv(imagePath)

     res.status(StatusCodes.OK).json({image:`/uploads/${companyImage.name}`});
};

module.exports = {
  createCompany,
  getAllCompanies,
  getSingleCompay,
  updateCompany,
  deleteCompany,
  uploadImage,
};
