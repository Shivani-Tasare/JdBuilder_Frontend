import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Job1ServiceService } from '../job-service.service';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ThemePalette } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  deletedMandatoryTags = [];
  deletedDesiredTags = [];
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
  mandatoryTags = new FormControl();
  desiredTags = new FormControl();
  filteredTags: Observable<string[]>;
  filteredTagsDesired: Observable<string[]>;
  mandatoryTagsList = [];
  desiredTagsList = [];
  allTags = [];
  allTagsDesired =[]
  isEditJd = false;
  selectedDesignationName = '';
  selectedLocationName = '';
  selectedExperienceName = '';
  jobDetail;
  suggestedMandatorySkill = [];
  suggestedDesiredSkill = [];
  suggestedQualification = [];
  suggestedResponsibilities = [];
  suggestedSummary = []
  selectedIndex = 2
  isSameUser = false
  submitted = false;
  isDuplicateDesignation = false
  filteredDesignations: string[] = []
  //slider property	
  color: ThemePalette = 'primary';
  isPrivateChecked = false;
  disabled = false;
  associatedTags = [];
  associatedDesiredTags =[];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagInputMandatory') tagInputMandatory: ElementRef<HTMLInputElement>;
  @ViewChild('tagInputDesired') tagInputDesired: ElementRef<HTMLInputElement>;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autoDesired') matAutocompleteDes: MatAutocomplete;
  desiredSkillData = [];
  mandatorySkillData = [];
  constructor(private formBuilder: FormBuilder, private jobService: Job1ServiceService, private toastr: ToastrService, private router: Router, private commonJobService: JobServiceService, private adalService: AdalService) { }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((document.body.scrollTop > 140 ||
      document.documentElement.scrollTop > 140) && document.getElementById('header')) {
      document.getElementById('header').classList.add('fixed-header');
    }
    if (document.documentElement.scrollTop < 1 && document.getElementById('header')) {
      document.getElementById('header').classList.remove('fixed-header');
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
  private _filterTag(value: any): string[] {
    const filterValue = value.Id ? value.Id.toLowerCase() : value.toLowerCase();
    return this.allTagsDesired.filter((option, index) => {
      return option.TagName.toLowerCase().includes(filterValue);
    });
  }
  ngOnInit() {

    const defaultMandatorySkill = [];
    const defaultDesiredSkill = [];
    const defaultQualification = [];
    const defaultResponsibility = [];
    defaultMandatorySkill.push(this.createMandatorySkill({
      isEditing: true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName: 'Mandatory'
    }));

    defaultDesiredSkill.push(this.createDesiredSkill({
      isEditing: true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName: 'Desired'
    }));

    
    defaultQualification.push(this.createQualification({ Id: 0, Name: '', isEditing: true }));
    defaultResponsibility.push(this.formBuilder.group({ Id: '', Responsibility: ['', Validators.required], isEditing: true }));

    this.jobDescriptionForm = this.formBuilder.group({
      title: new FormControl(''),
      about: new FormControl('', Validators.required),
      selectedDesignation: new FormControl('', Validators.required),
      selectedLocation: new FormControl('', Validators.required),
      selectedExperience: new FormControl('', Validators.required),
      mandatoryTags: new FormControl(''),
      desiredTags: new FormControl(''),
      desiredSkills: this.formBuilder.array(defaultDesiredSkill),
      mandatorySkills: this.formBuilder.array(defaultMandatorySkill),
      qualifications: this.formBuilder.array(defaultQualification),
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
        this.allTags = [...tags.ProfileTagsList];
        this.allTagsDesired = [...tags.ProfileTagsList];
        for (let index = 0; this.allTags.length > index; index++) {
          for (let index2 = 0; this.mandatoryTagsList.length > index2; index2++) {
            if (this.allTags[index].Id === this.mandatoryTagsList[index2].Id || this.allTags[index].TagName === this.mandatoryTagsList[index2].TagName) {
              this.allTags.splice(index, 1);
              index = 0;
              index2 = 0;
            }
          }
        }
        this.filteredTags = this.jobDescriptionForm.get("mandatoryTags").valueChanges
          .pipe(
            startWith(''),
            map(val => {
              if (val && val.length >= 2) {
                return this._filter(val);
              } else {
                return [];
              }
            })
          );
        for (let index = 0; this.allTagsDesired.length > index; index++) {
          for (let index2 = 0; this.desiredTagsList.length > index2; index2++) {
            if (this.allTagsDesired[index].Id === this.desiredTagsList[index2].Id || this.allTagsDesired[index].TagName === this.desiredTagsList[index2].TagName) {
              this.allTagsDesired.splice(index, 1);
              index = 0;
              index2 = 0;
            }
          }
        }
        this.filteredTagsDesired = this.jobDescriptionForm.get("desiredTags").valueChanges
          .pipe(
            startWith(''),
            map(val => {
              if (val && val.length >= 2) {
                return this._filterTag(val);
              } else {
                return [];
              }
            })
          );
      }
    });
  }
  compareWithFunc = (a: any, b: any) => a == b;
  createMandatorySkill(newSkill): FormGroup {
    return this.formBuilder.group({
      isEditing: newSkill.isEditing ? newSkill.isEditing : false,
      SkillId: String(newSkill.SkillId),
      SkillName: [newSkill.SkillName, Validators.required],
      SkillTypeId: newSkill.SkillTypeId,
      SkillTypeName: newSkill.SkillTypeName,
    });
  }
  createQualification(qualificationObj): FormGroup {
    qualificationObj.Name = [qualificationObj.Name, Validators.required]
    return this.formBuilder.group(qualificationObj);
  }
  createDesiredSkill(desiredSkill): FormGroup {
    return this.formBuilder.group({
      isEditing: desiredSkill.isEditing ? desiredSkill.isEditing : false,
      SkillId: String(desiredSkill.SkillId),
      SkillName: [desiredSkill.SkillName, Validators.required],
      SkillTypeId: 2,
      SkillTypeName: 'Desired'
    });
  }
  addMandatorySkill(index?,skills?): void {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    if(skills){
      this.mandatorySkills.push(this.createMandatorySkill({isEditing: true,SkillId: skills[index].SkillId,
        SkillName: skills[index].SkillName, SkillTypeId: 1, SkillTypeName: 'Mandatory'}));
    } else{
      const newSkill = {
        isEditing: true,
        SkillId: 0,
        SkillName: '',
        SkillTypeId: 1,
        SkillTypeName: 'Mandatory'
      };
      this.mandatorySkills.push(this.createMandatorySkill(newSkill));
    }
  }
  addDesiredSkill(index,skills?): void {
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    if(skills){
      this.desiredSkills.push(this.createDesiredSkill({isEditing: true,SkillId: skills[index].SkillId,
        SkillName: skills[index].SkillName, SkillTypeId: 2, SkillTypeName: 'Desired'}));
    } else{
      const newSkill = {
        isEditing: true,
        SkillId: 0,
        SkillName: '',
        SkillTypeId: 2,
        SkillTypeName: 'Desired'
      };
      this.desiredSkills.push(this.createDesiredSkill(newSkill));
    }
  }
  addQualification(): void {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    const obj = { Id: 0, Name: '', isEditing: true };
    this.qualifications.push(this.createQualification(obj));
  }
  addResponsibility(): void {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    const obj = { Id: '', Responsibility: ['', Validators.required], isEditing: true };
    this.rolesAndResponsibility.push(this.formBuilder.group(obj));
  }
  deleteSkill(deletedSkill,onRemove, index?) {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkillData = [];
    if(onRemove){
      this.mandatorySkills.value.forEach((deletedSkill,i)=>{
        if(deletedSkill.SkillId.startsWith('Id')) {
              this.mandatorySkills.removeAt(this.mandatorySkills.length - 1);
         }
      })
      this.populateMandatorySkills(this.mandatoryTagsList);
    }
    if(deletedSkill.SkillId !== undefined){
      if (deletedSkill.SkillId.value !== '0') {
        this.deletedSkills.push(deletedSkill.SkillId.value);
      }
      this.mandatorySkills.removeAt(index);
    }
  }
  deleteDesiredSkill(deletedSkill,onRemove,index?) {
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkillData = [];
    if(onRemove){
      this.desiredSkills.value.forEach((deletedSkill,i)=>{
        if(deletedSkill.SkillId.startsWith('Id')) {
              this.desiredSkills.removeAt(this.desiredSkills.length - 1);
         }
      })
      this.populateDesiredSkills(this.desiredTagsList);
    }
    if(deletedSkill.SkillId !== undefined){
      if (deletedSkill.SkillId.value !== '0') {
        this.deletedSkills.push(deletedSkill.SkillId.value);
      }
      this.desiredSkills.removeAt(index);
    }
  }
  deleteQualification(deletedQualification, index) {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    if (deletedQualification.Id.value !== 0) {
      this.deletedQualifications.push(deletedQualification.Id.value);
    }
    this.qualifications.removeAt(index);
  }
  deleteResponsiblity(deletedResponsibility, index: number) {
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

  addMandatoryTag(event: MatChipInputEvent, isAdd, TagType): void {
    if (isAdd) {
        const input = event.input;
        const value = event.value;
        // Add our tag
        if ((value || '').trim()) {
          this.mandatoryTagsList.push({ Id: '', TagName: value.trim(), TagType });
        }
        // Reset the input value
        if (input) {
          input.value = '';
        }       
        this.mandatoryTags.setValue(null);
      }
  }

  addDesiredTag(event: MatChipInputEvent, isAdd, TagType){
    if (isAdd) {
      const input = event.input;
      const value = event.value;
      // Add our tag
      if ((value || '').trim()) {
        this.desiredTagsList.push({ Id: '', TagName: value.trim(), TagType });
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }       
      this.desiredTags.setValue(null);
    }
  }
  appendToMandatoryTags(index) {
    this.mandatoryTagsList.push({Id: this.associatedTags[index].Id, TagName: this.associatedTags[index].TagName, TagType: 1});
    this.allTags  = this.allTags.filter((r)=>{
      return r.TagName  != this.associatedTags[index].TagName;
    });
    this.associatedTags.splice(index, 1);
    this.fetchAssociatedTags(this.mandatoryTagsList[this.mandatoryTagsList.length-1].TagName);
    this.populateMandatorySkills([this.mandatoryTagsList[this.mandatoryTagsList.length-1]])
  }
  appendToDesiredTags(index) {
    this.desiredTagsList.push({Id: this.associatedDesiredTags[index].Id, TagName: this.associatedDesiredTags[index].TagName, TagType:2});
    this.allTagsDesired  = this.allTagsDesired.filter((r)=>{
      return r.TagName  != this.associatedDesiredTags[index].TagName;
    });
    this.associatedDesiredTags.splice(index, 1);
    this.fetchAssociatedDesiredTags(this.desiredTagsList[this.desiredTagsList.length-1].TagName);
    this.populateDesiredSkills([this.desiredTagsList[this.desiredTagsList.length-1]])
  }
  removeDesiredTag(tag,TagType): void {
    const index = this.desiredTagsList.indexOf(tag);
    this.associatedDesiredTags = [];
    if(tag.Id.startsWith('ID')) {
          this.allTagsDesired  = this.allTagsDesired.filter((r)=>{
            return r.Id  != tag.Id;
          });
          this.desiredTagsList.splice(index, 1);
         } else {
    if (index >= 0) {
      this.desiredTagsList.splice(index, 1);
      this.allTagsDesired.push(tag);
      this.deletedDesiredTags.push({Id:tag.Id,TagType:tag.TagType});
    }
  }
    (!!this.desiredTagsList[this.desiredTagsList.length-1]) ? 
    this.fetchAssociatedDesiredTags(this.desiredTagsList[this.desiredTagsList.length-1].TagName)
    : null;
    this.deleteDesiredSkill(this.desiredSkills.value,true);
  }
  removeMandatoryTag(tag){
    const index = this.mandatoryTagsList.indexOf(tag);
    this.associatedTags = [];
    if(tag.Id.startsWith('ID')) {
          this.allTags  = this.allTags.filter((r)=>{
            return r.Id  != tag.Id;
          });
          this.mandatoryTagsList.splice(index, 1);
         } else {

    if (index >= 0) {
      this.mandatoryTagsList.splice(index, 1);
      this.deletedMandatoryTags.push({Id:tag.Id,TagType:tag.TagType});
      }
      
    }
    (!!this.mandatoryTagsList[this.mandatoryTagsList.length-1]) ? 
    this.fetchAssociatedTags(this.mandatoryTagsList[this.mandatoryTagsList.length-1].TagName)
    : null;
    this.deleteSkill(this.mandatorySkills.value,true);
  }

  fetchAssociatedTags(value) {
    this.associatedTags = [];
    this.jobService.FetchAssociatedTags(value).subscribe((skillData: any) => {
      const skillDataNamesOnly = [];
      this.mandatoryTagsList.filter((r)=>{
                  skillDataNamesOnly.push(r.TagName);
      });
     

      skillData.forEach((v,i)=> {
        if(skillDataNamesOnly.indexOf(v) < 0) {
          this.associatedTags.push({Id: `ID${i}`, TagName: v});
      }
      });
      this.associatedTags = this.associatedTags.splice(0,3)
    })
  }
  fetchAssociatedDesiredTags(value) {
    this.associatedDesiredTags = [];
    this.jobService.FetchAssociatedTags(value).subscribe((skillData: any) => {
      skillData = skillData.splice(0,3)
      skillData.forEach((v,i)=> {
        this.associatedDesiredTags.push({Id: `ID${i}`, TagName: v});
      });
    })
  }
  selectedDesiredTag(event: MatAutocompleteSelectedEvent,TagType): void {
    this.desiredTagsList.push(event.option.value);
    this.desiredTagsList.map(x => x.TagType = 2)
      this.tagInputDesired.nativeElement.value = '';
      this.allTagsDesired.filter((option, index) => {
        if (option.Id.toLowerCase().includes(event.option.value.Id)) {
          this.allTagsDesired.splice(index, 1);
        }
      });
      this.desiredTags.setValue(null);
      this.populateDesiredSkills([event.option.value]);
      this.fetchAssociatedDesiredTags(event.option.value.TagName);
  }

  selectedMandatoryTag(event: MatAutocompleteSelectedEvent,TagType){
    this.mandatoryTagsList.push(event.option.value);
    this.mandatoryTagsList.map(x => x.TagType = 1);
    this.tagInputMandatory.nativeElement.value = '';
    this.allTags.filter((option, index) => {
      if (option.Id.toLowerCase().includes(event.option.value.Id)) {
        this.allTags.splice(index, 1);
      }
    });
    this.mandatoryTags.setValue(null);
    this.populateMandatorySkills([event.option.value]);
    this.fetchAssociatedTags(event.option.value.TagName);
  }

  populateMandatorySkills(tag){
    this.mandatorySkillData = [];
    const tags = tag.map((res)=>res.TagName);
     this.jobService.FetchAssociatedSkills(tags).subscribe((res) => {
      res.forEach((v,i)=>{
        this.mandatorySkillData.push({SkillId:`Id${i}` , SkillName: v});
        this.addMandatorySkill(i,this.mandatorySkillData);
      })
     })
     this.toggleInputBox(true);
  }

  toggleInputBox(isMandatory){
    if(this.jobDescriptionForm.controls['mandatorySkills'].value[0].SkillName === "" && isMandatory){
      document.getElementById('inputboxMand').style.display = 'none';
      document.getElementById('dotIcon').style.display = 'none';
    }
   else if(this.jobDescriptionForm.controls['desiredSkills'].value[0].SkillName === ""){
      document.getElementById('inputboxDesi').style.display = 'none';
      document.getElementById('dotIconDesi').style.display = 'none';
    }
  }

  populateDesiredSkills(tag){
    this.desiredSkillData = [];
    const tags = tag.map((res)=>res.TagName);
    this.jobService.FetchAssociatedSkills(tags).subscribe((res) => {
      res.forEach((v,i)=>{
        this.desiredSkillData.push({SkillId:`Id${i}` , SkillName: v});
        this.addDesiredSkill(i,this.desiredSkillData);
      })
    })
    this.toggleInputBox(false);
  }
  selectedSkill(event: MatAutocompleteSelectedEvent, index, isMandatory): void {
    if (isMandatory) {
      this.jobDescriptionForm.controls['mandatorySkills'].value[index].SkillName = event.option.value
    } else {
      this.jobDescriptionForm.controls['desiredSkills'].value[index].SkillName = event.option.value
    }
  }
  selectQualification(event: MatAutocompleteSelectedEvent, index, isMandatory): void {
    this.jobDescriptionForm.controls['qualifications'].value[index].Name = event.option.value
  }
  selectResponsibility(event: MatAutocompleteSelectedEvent, index, isMandatory): void {
    this.jobDescriptionForm.controls['rolesAndResponsibility'].value[index].Responsibility = event.option.value
  }

  getMandatorySkill(event) {
    if (event.target.value.length > 2) {
      // check for letter and numbers
      const tags = this.mandatoryTagsList.map((res)=>res.TagName);
      if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)) {
        this.jobService.FetchAllSkills(event.target.value,tags).subscribe((skillData: any) => {
          if (skillData.StatusCode) {
            this.suggestedMandatorySkill = skillData.Skills;
          }
        })
      }
    }
  }
  getDesiredSkill(event) {
    if (event.target.value.length > 2) {
      // check for letter and numbers
      const tags = this.desiredTagsList.map((res)=>res.TagName);
      if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)) {
        this.jobService.FetchAllSkills(event.target.value,tags).subscribe((skillData: any) => {
          if (skillData.StatusCode) {
            this.suggestedDesiredSkill = skillData.Skills;
          }
        })
      }
    }
  }
  getQualifications(event) {
    if (event.target.value.length > 1) {
      // check for letter and numbers
      if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)) {
        this.jobService.FetchAllQualifications(event.target.value).subscribe((Data: any) => {
          if (Data.StatusCode) {
            this.suggestedQualification = Data.ProfileQualifications;
          }
        })
      }
    }
  }
  getResponsibilities(event) {
    if (event.target.value.length > 1) {
      // check for letter and numbers
      if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)) {
        this.jobService.FetchAllResponsibilities(event.target.value).subscribe((Data: any) => {
          if (Data.StatusCode) {
            this.suggestedResponsibilities = Data.ProfileResponsibilities;
          }
        })
      }
    }
  }
  FetchProfileSummary(designationEvent) {
    this.selectedDesignationName = designationEvent.viewValue;
    let designationObject = { designationId: designationEvent.value, name: designationEvent.viewValue }
    this.jobService.FetchProfileSummary(designationObject).subscribe((Data: any) => {
      if (Data.StatusCode) {
        this.suggestedSummary = Data.ProfileSummary;
      }
    })
  }
  selectSuggestion(selectedSuggestion) {
    this.jobDescriptionForm.patchValue({ about: selectedSuggestion })
  }
  clearSummary() {
    this.jobDescriptionForm.patchValue({ about: "" })
  }
  checkDuplicateDesignation(event) {

    if (isNaN(this.jobDescriptionForm.get('selectedDesignation').value)) {
      this.FetchProfileSummary({ value: 0, viewValue: event.target.value })
      let isChecked = false
      this.designations.forEach((designation: any) => {
        if (!isChecked) {
          if (designation.DesignationName.trim().toLowerCase() === event.target.value.trim().toLowerCase()) {
            this.isDuplicateDesignation = true
            isChecked = true
          } else {
            this.isDuplicateDesignation = false
          }
        }
      });
    }
  }
  filterDesignationList(evnt) {
    if ((evnt.keyCode >= 48 && evnt.keyCode <= 57) || (evnt.keyCode >= 65 && evnt.keyCode <= 90) || evnt.keyCode === 8) {
      if (evnt.target.value === '') {
        this.filteredDesignations = this.designations;
        return
      }
      this.filteredDesignations = this.designations.filter((designation: any) => {
        let strRegExPattern = evnt.target.value;
        if (designation.DesignationName.match(new RegExp(strRegExPattern, 'gi'))) {
          return designation;
        }
      })
    }
  }

  onSave() {
    this.submitted = true;
    if (this.jobDescriptionForm.invalid || this.mandatoryTagsList.length < 1 || this.desiredTagsList.length < 1 || this.isDuplicateDesignation) {
      return;
    }
    const jdObject = {
      ProfileName: this.jobDescriptionForm.get('title').value,
      About: this.jobDescriptionForm.get('about').value,
      DesignationId: isNaN(this.jobDescriptionForm.get('selectedDesignation').value) ? 0 : this.jobDescriptionForm.get('selectedDesignation').value,
      LocationId: this.jobDescriptionForm.get('selectedLocation').value,
      ExperienceId: this.jobDescriptionForm.get('selectedExperience').value,
      SkillList: [...this.jobDescriptionForm.get('mandatorySkills').value, ...this.jobDescriptionForm.get('desiredSkills').value],
      QualificationList: this.jobDescriptionForm.get('qualifications').value,
      ResponsibilityList: this.jobDescriptionForm.get('rolesAndResponsibility').value,
      TagsList:(this.mandatoryTagsList.concat(this.desiredTagsList)),
      DeletedQualifications: this.deletedQualifications,
      DeletedSkills: this.deletedSkills,
      DeletedResponsibilities: this.deletedResponsiblities,
      DeletedTags: (this.deletedMandatoryTags.concat(this.deletedDesiredTags)),
      NewDesignation: isNaN(this.jobDescriptionForm.get('selectedDesignation').value) ? this.jobDescriptionForm.get('selectedDesignation').value : undefined,
      isPrivate: this.isPrivateChecked
    };
    this.jobService.CreateProfile(jdObject).subscribe((updatedData: any) => {
      if (updatedData.StatusCode === 200) {

        this.toastr.success(updatedData.Message, 'Success');
        if (this.isSameUser) {
          this.isEditJd = false
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        } else {
          this.router.navigate(['myJd']);
        }

      } else {
        this.toastr.error(updatedData.Message, 'Error');
      }
    });
  }
}
