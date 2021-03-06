import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener, Inject, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Job1ServiceService } from '../job-service.service';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ThemePalette } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith, distinctUntilChanged, pairwise } from 'rxjs/operators';
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
  selectedDesignationId: number;
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
  desigOption: number;
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
    defaultResponsibility.push(this.formBuilder.group({ Id: '', Responsibility: ['',[Validators.required,this.noWhitespaceValidator]], isEditing: true }));

    this.jobDescriptionForm = this.formBuilder.group({
      title: new FormControl(''),
      about: new FormControl('', [Validators.required,this.noWhitespaceValidator]),
      selectedDesignation: new FormControl('', [Validators.required,Validators.pattern("(?!^ +$)^.+$")]),
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
        this.experiences = experiences.ResponseList;
      }
    });
    this.jobService.FetchLocationList().subscribe((locations: any) => {
      if (locations.StatusCode === 200) {
        this.locations = locations.ResponseList;
      }
    });
    this.jobService.FetchDesignationList().subscribe((designations: any) => {
      if (designations.StatusCode === 200) {
        this.designations = designations.ResponseList;
      }
    });
    this.jobService.FetchTagsList().subscribe((tags: any) => {
      if (tags.StatusCode === 200) {
        this.allTags =JSON.parse(JSON.stringify([...tags.ResponseList]));
            this.allTags.map((x) => x.TagType = 1);
            this.allTagsDesired = JSON.parse(JSON.stringify([...tags.ResponseList]));
            this.allTagsDesired.map((x)=> x.TagType = 2);
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
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  compareWithFunc = (a: any, b: any) => a == b;
  createMandatorySkill(newSkill): FormGroup {
    return this.formBuilder.group({
      isEditing: newSkill.isEditing ? newSkill.isEditing : false,
      SkillId: String(newSkill.SkillId),
      SkillName: [newSkill.SkillName, [Validators.required,this.noWhitespaceValidator]],
      SkillTypeId: newSkill.SkillTypeId,
      SkillTypeName: newSkill.SkillTypeName,
    });
  }
  createQualification(qualificationObj): FormGroup {
    qualificationObj.Name = [qualificationObj.Name, [Validators.required,this.noWhitespaceValidator]]
    return this.formBuilder.group(qualificationObj);
  }
  createDesiredSkill(desiredSkill): FormGroup {
    return this.formBuilder.group({
      isEditing: desiredSkill.isEditing ? desiredSkill.isEditing : false,
      SkillId: String(desiredSkill.SkillId),
      SkillName: [desiredSkill.SkillName, [Validators.required,this.noWhitespaceValidator]],
      SkillTypeId: 2,
      SkillTypeName: 'Desired'
    });
  }

  removeSpace(str) {
    return str.trim().replace(/[\s]+/g, ' ')
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
    const obj = { Id: '', Responsibility: ['', [Validators.required,this.noWhitespaceValidator]], isEditing: true };
    this.rolesAndResponsibility.push(this.formBuilder.group(obj));
  }
  deleteSkill(deletedSkill,onRemove,index?) {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    const skills = deletedSkill;
    this.mandatorySkillData = [];
    if(onRemove){
      this.mandatorySkills.value.forEach((deletedSkill,i)=>{
        let index = skills.findIndex((i)=>{
          return (i.SkillId.startsWith('Id'));
        })
        if(deletedSkill.SkillId.startsWith('Id')) {
              this.mandatorySkills.removeAt(index);  
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
    if(this.mandatorySkills.length == 0){
      this.mandatorySkills.push(this.createMandatorySkill({isEditing: true,
        SkillId: 0, SkillName: '', SkillTypeId: 1, SkillTypeName: 'Mandatory'}))
    }
  }
  deleteDesiredSkill(deletedSkill, onRemove ,index?) {
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkillData = [];
    const skills = deletedSkill;
    if(onRemove){
      this.desiredSkills.value.forEach((deletedSkill,i)=>{
        let index = skills.findIndex((i)=>{
          return (i.SkillId.startsWith('Id'));
        })
        if(deletedSkill.SkillId.startsWith('Id')) {
              this.desiredSkills.removeAt(index);
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
    if(this.desiredSkills.length == 0){
      this.desiredSkills.push(this.createDesiredSkill({isEditing: true,
        SkillId: 0, SkillName: '', SkillTypeId: 2, SkillTypeName: 'Desired'}))
    }
  }
  deleteQualification(deletedQualification, index) {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    if (deletedQualification.Id.value !== 0) {
      this.deletedQualifications.push(deletedQualification.Id.value);
    }
    this.qualifications.removeAt(index);
    this.qualifications.length == 0 ? this.addQualification() : null;
  }
  deleteResponsiblity(deletedResponsibility, index: number) {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    if (deletedResponsibility.Id.value !== 0) {
      this.deletedResponsiblities.push(deletedResponsibility.Id.value);
    }
    this.rolesAndResponsibility.removeAt(index);
    this.rolesAndResponsibility.length == 0 ? this.addResponsibility() : null;
  }

  isSkillNameNotEmpty(controls) {
    return controls.SkillName.value.trim() !=""; 
  }
  isQualificationEmpty(controls){
    return controls.Name.value.trim() !="";
  }
  isResponsibilityEmpty(controls){
  return controls.Responsibility.value.trim() !="";
  }
  moveToDesired(selectedSkill, index) {
    const updatedSkill = {
      SkillId: (`MID${selectedSkill.SkillId.value}`),
      SkillName: selectedSkill.SkillName.value
    };
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    if(this.desiredSkills.value[0].SkillName == '')
    this.desiredSkills.removeAt(0);
    this.desiredSkills.push(this.createDesiredSkill(updatedSkill));
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkills.removeAt(index);
    if(this.mandatorySkills.length == 0){
      this.mandatorySkills.push(this.createMandatorySkill({isEditing: true,
        SkillId: 0, SkillName: '', SkillTypeId: 1, SkillTypeName: 'Mandatory'}))
    }
  }
  moveToMandatory(selectedSkill, index) {
    const updatedSkill = {
      SkillId: (`MID${selectedSkill.SkillId.value}`),
      SkillName: selectedSkill.SkillName.value,
      SkillTypeId: 1,
      SkillTypeName: 'Mandatory'
    };
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    if(this.mandatorySkills.value[0].SkillName == '')
    this.mandatorySkills.removeAt(0);
    this.mandatorySkills.push(this.createMandatorySkill(updatedSkill));
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.removeAt(index);
    if(this.desiredSkills.length == 0){
      this.desiredSkills.push(this.createDesiredSkill({isEditing: true,
        SkillId: 0, SkillName: '', SkillTypeId: 2, SkillTypeName: 'Desired'}))
    }
  }

  addMandatoryTag(event: MatChipInputEvent, isAdd, TagType): void {
    if (isAdd) {
        const input = event.input;
        const value = event.value;
        let index = this.mandatoryTagsList.findIndex((i)=>{
          return (i.TagName == value);
        })
        // Add our tag
        if ((value || '').trim()) {
          if(index === -1 || value !== this.mandatoryTagsList[index].TagName)
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
      let index = this.desiredTagsList.findIndex((i)=>{
        return (i.TagName == value);
      })
      // Add our tag
      if ((value || '').trim()) {
        if(index === -1 || value !== this.desiredTagsList[index].TagName)
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
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    const index = this.desiredTagsList.indexOf(tag);
    this.associatedDesiredTags = [];
    if(tag.Id.startsWith('ID')) {
          this.allTagsDesired  = this.allTagsDesired.filter((r)=>{
            return r.Id  != tag.Id;
          });
          this.desiredTagsList.splice(index, 1);
          this.allTagsDesired.push(tag);
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
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    const index = this.mandatoryTagsList.indexOf(tag);
    this.associatedTags = [];
    if(tag.Id.startsWith('ID')) {
          this.allTags  = this.allTags.filter((r)=>{
            return r.Id  != tag.Id;
          });
          this.mandatoryTagsList.splice(index, 1);
          this.allTags.push(tag);
         } else {

    if (index >= 0) {
      this.mandatoryTagsList.splice(index, 1);
      this.allTags.push(tag);
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
      const skillDataNamesOnly = [];
      this.desiredTagsList.filter((r)=>{
        skillDataNamesOnly.push(r.TagName);
        });
        skillData.forEach((v,i)=> {
        if(skillDataNamesOnly.indexOf(v) < 0) {
        this.associatedDesiredTags.push({Id: `ID${i}`, TagName: v});
        }
        });
        this.associatedDesiredTags = this.associatedDesiredTags.splice(0,3)
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
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkillData = [];
    const tags = tag.map((res)=>res.TagName);
    this.jobService.FetchAssociatedSkills(tags,1).subscribe((res) => {
      res.forEach((v,i)=>{
          this.mandatorySkillData.push({SkillId:`Id${i}` , SkillName: v});
        for (let index2 = 0; this.mandatorySkills.length > index2; index2++) {
        if(v === this.mandatorySkills.value[index2].SkillName)
        this.mandatorySkillData.splice(i,1);
        }
        if(this.mandatorySkillData.length > 0)
         this.addMandatorySkill(i,this.mandatorySkillData) ;
         if(this.mandatorySkills.value[0].SkillName==='')
          this.mandatorySkills.removeAt(0);
     })
  })
}

 populateDesiredSkills(tag){
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkillData = [];
    const tags = tag.map((res)=>res.TagName);
    this.jobService.FetchAssociatedSkills(tags,2).subscribe((res) => {
      res.forEach((v,i)=>{
          this.desiredSkillData.push({SkillId:`Id${i}` , SkillName: v});
          for (let index2 = 0; this.desiredSkills.length > index2; index2++) {
            if(v === this.desiredSkills.value[index2].SkillName)
            this.desiredSkillData.splice(i,1);
      }
      if(this.desiredSkillData.length > 0)
        this.addDesiredSkill(i,this.desiredSkillData);
        if(this.desiredSkills.value[0].SkillName==='')
          this.desiredSkills.removeAt(0);
      })
    })
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
    this.jobDescriptionForm.controls['rolesAndResponsibility'].value[index].Responsibility = this.removeSpace(event.option.value)
  }

  getMandatorySkill(event) {
    if (event.target.value.length > 2) {
      // check for letter and numbers
      const tags = this.mandatoryTagsList.map((res)=>res.TagName);
      if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)) {
        this.jobService.FetchAllSkills(event.target.value,tags).subscribe((skillData: any) => {
          if (skillData.StatusCode) {
            this.suggestedMandatorySkill = skillData.ResponseList;
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
            this.suggestedDesiredSkill = skillData.ResponseList;
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
            this.suggestedQualification = Data.ResponseList;
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
            this.suggestedResponsibilities = Data.ResponseList;
          }
        })
      }
    }
  }
  getDesignationNameFromID(designationEvent:  string) {
    return this.designations.find((r: any) => r.Id == designationEvent)['DesignationName'];
  }
  FetchProfileSummary(designationEvent) {
    this.desigOption = 3;
    this.selectedDesignationName = this.getDesignationNameFromID(designationEvent.value);
    let designationObject = { designationId: designationEvent.value, name: designationEvent.viewValue }
    this.jobService.FetchProfileSummary(designationObject).subscribe((Data: any) => {
      if (Data.StatusCode) {
        this.suggestedSummary = Data.ProfileSummary;
      }
    })
  }
  removeDesignation(event){
    this.desigOption = event.length;
    let length = this.jobDescriptionForm.get('selectedDesignation').value.length;
    length == undefined ? this.selectedDesignationName = '' : null; 
  }
  selectSuggestion(selectedSuggestion) {
    this.jobDescriptionForm.patchValue({ about: selectedSuggestion })
  }

  checkDuplicateDesignation(event) {
    //this.FetchProfileSummary({ value: 0, viewValue: event.target.value })
      let isChecked = false
      this.designations.forEach((designation: any) => {
        if (!isChecked) {
          if (designation.DesignationName.trim().toLowerCase() === event.target.value.trim().toLowerCase()) {
            this.isDuplicateDesignation = true
            this.selectedDesignationId = designation.Id;
            isChecked = true
          } else {
            this.isDuplicateDesignation = false
          }
        }
      });
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

  getIdsOfMovedToMandatorySkills(){
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    for(let i=0; i < this.mandatorySkills.length; i++){
      if(this.mandatorySkills.value[i].SkillId.startsWith('MID')){
       const id =  this.mandatorySkills.value[i].SkillId.slice(3);
       const SkillName = this.mandatorySkills.value[i].SkillName;
       this.mandatorySkills.removeAt(i);
       this.mandatorySkills.push(this.createMandatorySkill({isEditing: true,SkillId: id,
        SkillName: SkillName, SkillTypeId: 1, SkillTypeName: 'Mandatory'}))
        i = -1;
      }
    }
  }
  getIdsOfMovedToDesiredSkills(){
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    for(let i=0; i < this.desiredSkills.length; i++){
      if(this.desiredSkills.value[i].SkillId.startsWith('MID')){
       const id =  this.desiredSkills.value[i].SkillId.slice(3);
       const SkillName = this.desiredSkills.value[i].SkillName;
       this.desiredSkills.removeAt(i);
       this.desiredSkills.push(this.createDesiredSkill({isEditing: true,SkillId: id,
        SkillName: SkillName, SkillTypeId: 2, SkillTypeName: 'Desired'}))
        i = -1;
      }
    }
  }

  onSave() {
    this.getIdsOfMovedToMandatorySkills();
    this.getIdsOfMovedToDesiredSkills();
    this.submitted = true;
    if (this.jobDescriptionForm.invalid || this.mandatoryTagsList.length < 1 || this.desiredTagsList.length < 1) {
      return;
    }

    
    const jdObject = {
      ProfileName: this.jobDescriptionForm.get('title').value,
      About: this.jobDescriptionForm.get('about').value,
      DesignationId: !this.isDuplicateDesignation ? 0 :  this.selectedDesignationId,
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
      NewDesignation: !this.isDuplicateDesignation ? this.jobDescriptionForm.get('selectedDesignation').value : undefined,
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
          this.router.navigate(['jd-creator/myJd']);
        }

      } else {
        this.toastr.error(updatedData.Message, 'Error');
      }
    });
  }
}
