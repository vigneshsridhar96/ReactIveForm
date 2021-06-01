import { Component, OnInit } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators,  } from '@angular/forms'
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
  // user = {
  //   programs: [
  //     { name: 'Java',   id: 1 },
  //     { name: 'Python',  id: 2 },
  //     { name: 'Ruby',  id: 3 },
  //     { name: 'Javascript',  id: 4 },
  //   ]
  // }
  user = {
    skills: [
      { name: 'JS',  selected: true, id: 1 },
      { name: 'CSS',  selected: false, id: 2 },
    ]
  }
  // programs: Array<string>= [
  //   "Ruby",
  //   "Java",
  //   "Python",
  //   "JavaScript"
  // ]
  selectedProgramValues = []
  favProgramError:Boolean = true
  employeeModelObj : EmployeeModel =  new EmployeeModel();

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  clickAddEmploye(){
    this.showAdd = true
    this.showUpdate = false
  }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      firstName : [null, Validators.required],
      lastName : [null, Validators.required],
      email : [null, Validators.compose([Validators.required, Validators.email])],
      mobile : [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      salary : [null, Validators.required],
      //specialist: this.formbuilder.array([]),
      skills: this.buildSkills(),
      gender: [null, Validators.required]
    })
    this.getAllEmployees();
  }

  get skillsSpecialist() {
    console.log(`skills => ${this.formValue.get('skills')}`)
    return this.formValue.get('skills') as FormArray
  };

  buildSkills() {
    const arr = this.user.skills.map(skill => {
      return this.formbuilder.control(skill.selected);
    });
    return this.formbuilder.array(arr);
  }

  // onCheckboxChange(e: any) {
  //   const value: FormArray = <FormArray>this.formValue.get('specialist');
  //   if (e.target.checked) {
  //     value.push(new FormControl(e.target.value));
  //   }else {
  //     let i: number = 0;
  //     value.controls.forEach((item) => {
  //       if (item.value == e.target.value) {
  //         value.removeAt(i);
  //         return;
  //       }
  //       i++;

  //     });
  //   }
  //   console.log(this.formValue.value.specialist)
  // }

  // addProgramsControls(){
  //   const arr = this.user["programs"].map((ele)=>{
  //     return this.formbuilder.control(false);
  //   })
  //   return this.formbuilder.array(arr);
  // }

  // get programsArray(){
  //   return <FormArray>this.formValue.get("specialist")
  // }

  // getSelectedFruitsValue() {
  //   this.selectedProgramValues = [];
  //   // this.formValue.controls.forEach((control, i) => {
  //   //   if (control.value) {
  //   //     this.selectedProgramValues.push();
  //   //   }
  //   // });
  //   this.favProgramError =  this.selectedProgramValues.length > 0 ? false : true;
  // }

  postEmployeeDetails(){
    this.employeeModelObj.firstName = this.formValue.value.firstName
    this.employeeModelObj.lastName = this.formValue.value.lastName
    this.employeeModelObj.email = this.formValue.value.email
    this.employeeModelObj.mobile = this.formValue.value.mobile
    this.employeeModelObj.salary = this.formValue.value.salary
    this.employeeModelObj.specialist = this.formValue.value.specialist
    this.employeeModelObj.gender = this.formValue.value.gender

    this.api.postEmploye(this.employeeModelObj).subscribe(
      res => {
        let ref = document.getElementById("closeModelBox")
        ref?.click();
        this.formValue.reset();
        console.log(this.formValue.value.specialist);
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
      }
    )
    console.log("formVAlue",this.formValue.value.specialist)
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
    employe.specialist.forEach( (ele: any)  =>
    this.formValue.controls['specialist'].setValue(ele)
    );
    console.log("specialist=>",employe.gender)

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
