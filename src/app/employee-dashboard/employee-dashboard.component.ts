import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from '../shared/api.service';
import { EmployeeModel} from './employee-db.model'

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue! : FormGroup;
  employeesData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  salariesDetails: any[] = [
    "Low > below 10,000",
    "Medium > above 10,000 to below 50,000",
    "High > above 50,000",
  ]
  programs: Array<string>= [
    "Ruby",
    "Java",
    "Python",
    "JavaScript"
  ]
  employeeModelObj : EmployeeModel =  new EmployeeModel();

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  clickAddEmploye(){
    this.showAdd = true
    this.showUpdate = false
  }

  onCheckboxChange(){

  }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      firstName : [null, Validators.required],
      lastName : [null, Validators.required],
      email : [null, Validators.compose([Validators.required, Validators.email])],
      mobile : [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      salary : [null, Validators.required],
      specialist: this.addProgramsControls(),
      gender: [null, Validators.required]
    })
    this.getAllEmployees();
  }

  addProgramsControls(){
    const arr = this.programs.map((ele)=>{
      return this.formbuilder.control(false);
    })
    return this.formbuilder.array(arr);
  }

  get programsArray(){
    console.log("programArray => ", this.formValue.get("specialist"))
    return <FormArray>this.formValue.get("specialist")
  }

  postEmployeeDetails(){
    this.employeeModelObj.firstName = this.formValue.value.firstName
    this.employeeModelObj.lastName = this.formValue.value.lastName
    this.employeeModelObj.email = this.formValue.value.email
    this.employeeModelObj.mobile = this.formValue.value.mobile
    this.employeeModelObj.salary = this.formValue.value.salary
    this.employeeModelObj.specialist = ["java", "python", "Javascript"]
    this.employeeModelObj.gender = this.formValue.value.gender

    this.api.postEmploye(this.employeeModelObj).subscribe(
      res => {
        let ref = document.getElementById("closeModelBox")
        ref?.click();
        this.formValue.reset();
        this.getAllEmployees();
      },
      err => {
        alert("something went wrong")
      }
    )
  }

  getAllEmployees(){
    this.api.getEmploye().subscribe(
      res => {
        this.employeesData = res
        console.log("Employee data => ", this.employeesData);
      }
    )
  }

  deleteEmployeDetail(employe:any){
    this.api.deleteEmploye(employe.id).subscribe(
      res => {
        this.getAllEmployees()
      },
      err => { alert("something went wrong")}
    )
  }

  onEdit(employe:any){
    this.showAdd = false
    this.showUpdate = true
    this.employeeModelObj.id = employe.id
    this.formValue.controls['firstName'].setValue(employe.firstName);
    this.formValue.controls['lastName'].setValue(employe.lastName);
    this.formValue.controls['email'].setValue(employe.email);
    this.formValue.controls['mobile'].setValue(employe.mobile);
    this.formValue.controls['salary'].setValue(employe.salary);
    this.formValue.controls['gender'].setValue(employe.gender);
  }

  updateEmployeeDetails(){
    this.employeeModelObj.firstName = this.formValue.value.firstName
    this.employeeModelObj.lastName = this.formValue.value.lastName
    this.employeeModelObj.email = this.formValue.value.email
    this.employeeModelObj.mobile = this.formValue.value.mobile
    this.employeeModelObj.salary = this.formValue.value.salary
    this.employeeModelObj.gender = this.formValue.value.gender
    this.api.putEmploye(this.employeeModelObj, this.employeeModelObj.id).subscribe(
      res =>  {
      let ref = document.getElementById("closeModelBox")
      ref?.click();
      this.formValue.reset();
      this.getAllEmployees();
      },
      err => { alert("something went wrong")}
    )
  }
}
