import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Job1ServiceService } from '../job-service.service';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { JobServiceService } from '../../../shared/services/job-service.service';
import { AdalService } from 'src/app/shared/services/adal.service';
@Component({
  selector: 'app-create-jd',
  templateUrl: './create-jd.component.html',
  styleUrls: ['../job-detail/job-detail.component.scss']
})
export class CreateJdComponent implements OnInit {
  jobDescriptionForm: FormGroup;
  mandatorySkills: FormArray;
  desiredSkills: FormArray;
  qualifications: FormArray;
  rolesAndResponsibility: FormArray;
  deletedSkills: string[] = [];
  deletedQualifications: string[] = [];
  deletedResponsiblities: string[] = [];
  deletedTags: string[] = [];
  designations: string[] = [];
  experiences: string[] = [];
  locations: string[] = [];
  isDataFetched = false;
  reloading = false;
  // chips variable
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags = [];
  allTags = [];
  isEditJd = false;
  selectedDesignationName = '';
  selectedLocationName = '';
  selectedExperienceName = '';
  jobDetail;
  suggestedSkill = [];
  suggestedQualification = [];
  suggestedResponsibilities = [];
  suggestedSummary = []
  selectedIndex = 2
  isSameUser = false
  submitted = false;
  isDuplicateDesignation = false
  filteredDesignations: string[] = []
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(private formBuilder: FormBuilder, private jobService: Job1ServiceService, private toastr: ToastrService,private router: Router, private commonJobService: JobServiceService, private adalService:AdalService) { }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((document.body.scrollTop > 140 ||
    document.documentElement.scrollTop > 140) && document.getElementById('header')) {
      document.getElementById('header').classList.add('fixed-header');
      // document.getElementById('paragraph').classList.add('green');
    }
    if (document.documentElement.scrollTop < 1 && document.getElementById('header')) {
        document.getElementById('header').classList.remove('fixed-header');
        // document.getElementById('paragraph').classList.add('green');
      }
  }
  fixHeader() {
    document.getElementById('header').classList.add('fixed-header');
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  private _filter(value: any): string[] {
    const filterValue = value.Id ? value.Id.toLowerCase() : value.toLowerCase();
    return this.allTags.filter((option, index) => {
      return option.TagName.toLowerCase().includes(filterValue);
    });
  }
  ngOnInit() {

    const defaultMandatorySkill = [];
    const defaultDesiredSkill = [];
    const defaultQualification = [];
    const defaultResponsibility = [];
    defaultMandatorySkill.push(this.createMandatorySkill({
      isEditing:true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName : 'Mandatory'}));

    defaultDesiredSkill.push(this.createDesiredSkill({
      isEditing:true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName : 'Desired'}));

    defaultQualification.push(this.createQualification({Id: 0, Name: '',isEditing:true}));
    defaultResponsibility.push(this.formBuilder.group({Id: '', Responsibility: ['',Validators.required],isEditing:true}));

    this.jobDescriptionForm = this.formBuilder.group({
      title: new FormControl(''),
      about: new FormControl('', Validators.required),
      selectedDesignation: new FormControl('',Validators.required),
      selectedLocation: new FormControl('',Validators.required),
      selectedExperience: new FormControl('',Validators.required),
      tagsCtrl: new FormControl(''),
      desiredSkills: this.formBuilder.array(defaultDesiredSkill),
      mandatorySkills: this.formBuilder.array(defaultMandatorySkill),
      qualifications:  this.formBuilder.array(defaultQualification),
      rolesAndResponsibility: this.formBuilder.array(defaultResponsibility),
    });
    this.jobService.FetchExperienceList().subscribe((experiences: any) => {
      if (experiences.StatusCode === 200) {
        this.experiences = experiences.ExperienceMasterList;
      }
    });
    this.jobService.FetchLocationList().subscribe((locations: any) => {
      if (locations.StatusCode === 200) {
        this.locations = locations.LocationMasterList;
      }
    });
    this.jobService.FetchDesignationList().subscribe((designations: any) => {
      if (designations.StatusCode === 200) {
        this.designations = designations.DesignationList;
      }
    });
    this.jobService.FetchTagsList().subscribe((tags: any) => {
      if (tags.StatusCode === 200) {
        this.allTags = tags.ProfileTagsList;
        // this.tagsCtrl = tags.DesignationList;
        for (let index = 0; this.allTags.length > index ; index++) {
          for (let index2 = 0; this.tags.length > index2 ; index2++) {
            if (this.allTags[index].Id === this.tags[index2].Id) {
              this.allTags.splice(index, 1);
              index = 0;
              index2 = 0;
            }
          }
        }
        this.filteredTags = this.jobDescriptionForm.get("tagsCtrl").valueChanges
        .pipe(
          startWith(''),
          map(val => {
            if (val && val.length >= 2) {
              return this._filter(val);
            } else {
              return [];
            }
          } )
        );
      }
    });
  }
  compareWithFunc = (a: any, b: any) => a == b;
  createMandatorySkill(newSkill): FormGroup {
    return this.formBuilder.group({
        isEditing: newSkill.isEditing?newSkill.isEditing:false,
        SkillId: newSkill.SkillId,
        SkillName: [newSkill.SkillName,Validators.required],
        SkillTypeId: newSkill.SkillTypeId,
        SkillTypeName : newSkill.SkillTypeName,
    });
  }
  createQualification(qualificationObj): FormGroup {
    qualificationObj.Name = [qualificationObj.Name,Validators.required]
    return this.formBuilder.group(qualificationObj);
  }
  createDesiredSkill(desiredSkill): FormGroup {
    return this.formBuilder.group({
      isEditing:desiredSkill.isEditing?desiredSkill.isEditing:false,
      SkillId: desiredSkill.SkillId,
      SkillName: [desiredSkill.SkillName,Validators.required],
      SkillTypeId: 2,
      SkillTypeName : 'Desired'
    });
  }
  addMandatorySkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    const newSkill = {
      isEditing:true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName : 'Mandatory'};
    this.mandatorySkills.push(this.createMandatorySkill(newSkill));
  }
  addDesiredSkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    const newSkill = {
      isEditing:true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName : 'Desired'};
    this.mandatorySkills.push(this.createDesiredSkill(newSkill));
  }
  addQualification(): void {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    const obj = {Id: 0, Name: '',isEditing:true};
    this.qualifications.push(this.createQualification(obj));
  }
  addResponsibility(): void {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    const obj = {Id: '', Responsibility: ['',Validators.required],isEditing:true};
    this.rolesAndResponsibility.push(this.formBuilder.group(obj));
  }
  deleteSkill(deletedSkill, index) {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    if (deletedSkill.SkillId.value !== 0) {
      this.deletedSkills.push(deletedSkill.SkillId.value);
    }
    this.mandatorySkills.removeAt(index);
  }
  deleteDesiredSkill(deletedSkill, index) {
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    if (deletedSkill.SkillId.value !== 0) {
      this.deletedSkills.push(deletedSkill.SkillId.value);
    }
    this.desiredSkills.removeAt(index);
  }
  deleteQualification(deletedQualification, index) {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    if (deletedQualification.Id.value !== 0) {
      this.deletedQualifications.push(deletedQualification.Id.value);
    }
    this.qualifications.removeAt(index);
  }
  deleteResponsiblity( deletedResponsibility, index: number) {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    if (deletedResponsibility.Id.value !== 0) {
      this.deletedResponsiblities.push(deletedResponsibility.Id.value);
    }
    this.rolesAndResponsibility.removeAt(index);
  }
  moveToDesired(selectedSkill, index) {
    const updatedSkill = {
      SkillId: selectedSkill.SkillId.value,
      SkillName: selectedSkill.SkillName.value
    };
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.push(this.createDesiredSkill(updatedSkill));
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkills.removeAt(index);
  }
  moveToMandatory(selectedSkill, index) {
    const updatedSkill = {
      SkillId: selectedSkill.SkillId.value,
      SkillName: selectedSkill.SkillName.value,
      SkillTypeId: 1,
      SkillTypeName: 'Mandatory'
    };
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkills.push(this.createMandatorySkill(updatedSkill));
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.removeAt(index);
  }
  // get mandatorySkills(): FormArray { return this.jobDescriptionForm.get('mandatorySkills') as FormArray; }
  // get qualifications(): FormArray { return this.jobDescriptionForm.get('qualifications') as FormArray; }

  // addMandatorySkill(): void {
  //   this.mandatorySkills.push(new FormControl());
  // }
  add(event: MatChipInputEvent, isAdd): void {
    if (isAdd) {
      const input = event.input;
      const value = event.value;
      // Add our tag
      if ((value || '').trim()) {
        this.tags.push({Id: '', TagName: value.trim()});
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.tagsCtrl.setValue(null);
    }

  }

  removeTag(tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.allTags.push(tag);
      this.deletedTags.push(tag.Id);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.allTags.filter((option, index) => {
      if (option.Id.toLowerCase().includes(event.option.value.Id)) {
        this.allTags.splice(index, 1);
      }
    });
    this.tagsCtrl.setValue(null);
  }
  selectedSkill(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
    if(isMandatory){
      this.jobDescriptionForm.controls['mandatorySkills'].value[index].SkillName = event.option.value
    }else{
      this.jobDescriptionForm.controls['desiredSkills'].value[index].SkillName = event.option.value
    }
  }
  selectQualification(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
      this.jobDescriptionForm.controls['qualifications'].value[index].Name = event.option.value
  }
  selectResponsibility(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
      this.jobDescriptionForm.controls['rolesAndResponsibility'].value[index].Responsibility = event.option.value
  }

  getSkill(event){
    if(event.target.value.length >2){
      // check for letter and numbers
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllSkills(event.target.value).subscribe((skillData: any)=>{
          if(skillData.StatusCode){
            this.suggestedSkill = skillData.Skills;
          }
        })
      }
    }
  }
  getQualifications(event){
    if(event.target.value.length >1){
      // check for letter and numbers
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllQualifications(event.target.value).subscribe((Data: any)=>{
          if(Data.StatusCode){
            this.suggestedQualification = Data.ProfileQualifications;
          }
        })
      }
    }
  }
  getResponsibilities(event){
    if(event.target.value.length >1){
      // check for letter and numbers
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllResponsibilities(event.target.value).subscribe((Data: any)=>{
          if(Data.StatusCode){
            this.suggestedResponsibilities = Data.ProfileResponsibilities;
          }
        })
      }
    }
  }
  FetchProfileSummary(designationEvent){
    this.selectedDesignationName = designationEvent.viewValue;
    let designationObject = {designationId:designationEvent.value,name:designationEvent.viewValue}
    this.jobService.FetchProfileSummary(designationObject).subscribe((Data: any)=>{
      if(Data.StatusCode){
        this.suggestedSummary = Data.ProfileSummary;
      }
    })
  }
  selectSuggestion(selectedSuggestion){
    this.jobDescriptionForm.patchValue({about: selectedSuggestion})
  }
  clearSummary(){
    this.jobDescriptionForm.patchValue({about: ""})
  }
  checkDuplicateDesignation(event){

    if(isNaN(this.jobDescriptionForm.get('selectedDesignation').value)){
      this.FetchProfileSummary({value:0,viewValue:event.target.value})
      let isChecked = false
      this.designations.forEach((designation:any) => {

        if(!isChecked){
          if(designation.DesignationName.trim().toLowerCase() === event.target.value.trim().toLowerCase()){
            this.isDuplicateDesignation = true
            isChecked = true
          }else{
            this.isDuplicateDesignation = false
          }
        }
      });
    }
  }
  filterDesignationList(evnt){
    // return
    if((evnt.keyCode >= 48 && evnt.keyCode <= 57) || (evnt.keyCode >= 65 && evnt.keyCode <= 90) || evnt.keyCode === 8){
      if(evnt.target.value === ''){
        this.filteredDesignations = this.designations;
        return
      }
      this.filteredDesignations = this.designations.filter((designation: any)=>{
        let strRegExPattern = evnt.target.value;
        if(designation.DesignationName.match(new RegExp(strRegExPattern,'gi'))){
          // alert('match')
          return designation;
        }
      })
    }
  }
  // activateClass(index){
  //   this.commonJobService.changeSideBarIndex(index)
  // }
  onSave() {
    this.submitted = true;
          // stop here if form is invalid
          if (this.jobDescriptionForm.invalid || this.tags.length<1 || this.isDuplicateDesignation) {
            return;
        }
    const jdObject = {
      // ProfileId: location.pathname.split('/').pop(),
      ProfileName: this.jobDescriptionForm.get('title').value,
      About: this.jobDescriptionForm.get('about').value,
      DesignationId: isNaN(this.jobDescriptionForm.get('selectedDesignation').value)?0:this.jobDescriptionForm.get('selectedDesignation').value,
      LocationId: this.jobDescriptionForm.get('selectedLocation').value,
      ExperienceId: this.jobDescriptionForm.get('selectedExperience').value,
      SkillList: [...this.jobDescriptionForm.get('mandatorySkills').value, ...this.jobDescriptionForm.get('desiredSkills').value],
      QualificationList: this.jobDescriptionForm.get('qualifications').value,
      ResponsibilityList: this.jobDescriptionForm.get('rolesAndResponsibility').value,
      TagsList: this.tags,
      DeletedQualifications: this.deletedQualifications,
      DeletedSkills: this.deletedSkills,
      DeletedResponsibilities: this.deletedResponsiblities,
      DeletedTags: this.deletedTags,
      NewDesignation:isNaN(this.jobDescriptionForm.get('selectedDesignation').value)?this.jobDescriptionForm.get('selectedDesignation').value:undefined
    };
    this.jobService.CreateProfile(jdObject).subscribe((updatedData: any) => {
      if (updatedData.StatusCode === 200){

        this.toastr.success(updatedData.Message, 'Success');
        // location.reload();
        if(this.isSameUser){
          this.isEditJd = false
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }else{
          // this.commonJobService.changeSideBarIndex(2)
          this.router.navigate(['myJd']);
        }

      }else{
        this.toastr.error(updatedData.Message, 'Error');
      }
    });
  }
}
