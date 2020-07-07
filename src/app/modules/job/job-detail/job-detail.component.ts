import { Component, OnInit, Directive, ChangeDetectorRef, ElementRef, ViewChild, HostListener, Inject, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Job1ServiceService } from '../job-service.service';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { JobServiceService } from '../../../shared/services/job-service.service';
import { AdalService } from 'src/app/shared/services/adal.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SmartServiceService } from 'src/app/services/smart-service.service';
import { JdDetails } from 'src/app/shared/models/jd-details';
import { MatchingConsultants } from 'src/app/shared/models/matchingConsultants';
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  length = 100;
 iCIMSCandidates = null;
 //iCIMSCandidates = [];
  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageSelected = 0;
  DefaultPageSize = 5;
  jobDescriptionForm: FormGroup;
  mandatorySkills: FormArray;
  desiredSkills: FormArray;
  qualifications: FormArray;
  rolesAndResponsibility: FormArray;
  deletedSkills: string[] = [];
  candidateRecordsAsPerSection;
  deletedQualifications: string[] = [];
  deletedResponsiblities: string[] = [];
  allTagsDesired =[]
  deletedMandatoryTags = [];
  deletedDesiredTags = [];
  designations: string[] = [];
  filteredDesignations: string[] = []
  experiences: string[] = [];
  locations: string[] = [];
  isDataFetched = false;
  reloading = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  filteredTagsDesired: Observable<string[]>;
  tags = [] ;
  allTags = [];
  isEditJd = false;
  selectedDesignationName;
  selectedLocationName = [];
  selectedExperienceName;
  jobDetail;
  suggestedMandatorySkill = [];
  suggestedDesiredSkill = [];
  suggestedQualification = [];
  suggestedResponsibilities = [];
  mandatoryTags = new FormControl();
  desiredTags = new FormControl();
  suggestedSummary = []
  selectedIndex = 2
  isSameUser = false
  submitted = false;
  isDuplicateDesignation = false
  IsReviewJd;
  saveAsCopy;
  IsSharedJD;
  mandatoryTagsList = [];
  desiredTagsList = [];
  IsReviewMode = 0;
  copiedJd;
  jdDetails: JdDetails[];
  emailSearch = new FormControl();
  associatedTags = [];
  associatedSkills = [];
  associatedDesriredSkills = [];
  associatedDesiredTags = [];
  //[['90-100% '], ['80-90% '], ['70-80 %'], ['<70 %']];
  candidateCountList = [
    { id: 0, range: '90 to 100', count: 0 , candidateDetail: [], label: '90-100% '},
    { id: 1, range: '80 to 90', count: 0 , candidateDetail: [], label: '80-90% '},
    { id: 2, range: '70 to 80', count: 0, candidateDetail: [] , label: '70-80 %'},
    { id: 3, range: '< 70', count: 0, candidateDetail: [], label: '<70 %' }
  ]
  color: ThemePalette = 'primary';
  isPrivateChecked = false;
  disabled = false;

  @ViewChild('tagInputMandatory') tagInputMandatory: ElementRef<HTMLInputElement>;
  @ViewChild('tagInputDesired') tagInputDesired: ElementRef<HTMLInputElement>;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
 @ViewChild('autoDesired') matAutocompleteDes: MatAutocomplete;
  @ViewChild('content', {}) content: ElementRef;
  capturedImage;
  candidatesCount: number[];
  matchingConsultants: MatchingConsultants[];
  url: string;
  filteredEmails: any;
  isIconChecked: boolean = false;
  tagName: string[]=[];
  mandatorySkillData = [];
  desiredSkillData = [];
  selectmandatorytags: any[];
  selectdesiredtags: any[];
  isDeletedJD: boolean = false;
  desigOption: number;
  constructor(private loaderService: LoaderService, private changeDetectorRefs: ChangeDetectorRef,public dialog: MatDialog, @Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private jobService: Job1ServiceService, private toastr: ToastrService, private router: Router, private commonJobService: JobServiceService, private adalService: AdalService, private route: ActivatedRoute, private smartService: SmartServiceService) {
  }
  
  public downloadPDF2() {
    let htmlContent = this.document.getElementById('content-pdf')
    let fileName = this.selectedDesignationName;
    this.jobService.GeneratePDF({ htmlContent: htmlContent.outerHTML , fileName:fileName }).subscribe((data: any) => {
      let blob = new Blob([data.body], {
        type: 'application/pdf'
      });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.selectedDesignationName + '.pdf';
      link.click();
      window.URL.revokeObjectURL(link.href);
    })
  }

  // openCandidateProfile(link) {
  //   window.location.href = "";

  // }
  onChartClick(event) {
    if(!!event.active.length) {

    const candidateRecords = this.candidateCountList.filter( (r) => {
      return r.label == event.active[0]._model.label;
    });
    if(candidateRecords[0].count > 0) {
      this.candidateRecordsAsPerSection = candidateRecords[0].candidateDetail;
    }
    }
  }
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
      onClick: null
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  public pieChartLabels: Label[] = [['90-100% '], ['80-90% '], ['70-80 %'], ['<70 %']];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#264d00', '#66cc00', '#b3ff66', '#ffa600'],
    },
  ];

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
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
    this.initLoad();
    //for edit mode
    if (window.location.href.includes('edit')) {
      this.isEditJd = true;
    } else {
      this.isEditJd = false;
    }
    this.route.queryParams.subscribe(params => {
      this.IsReviewMode = +params;
    })
    //for review mode
    if (window.location.href.includes('reviewMode=1')) {
      this.IsReviewJd = true;
    } else {
      this.IsReviewJd = false;
    }
    // for shared JDs
    if (window.location.href.includes('IsSharedJd=true')) {
      this.IsSharedJD = true;
    }
    if (window.location.href.includes('allJd/job-description/view')) {
      this.copiedJd = true;
    }
    if (window.location.href.includes('saveCopy=true')) {
      this.saveAsCopy = true;
    }
  }

  onEdit() {
    if (this.copiedJd) {
      if (!this.isSameUser) {
        this.router.navigate(['jd/job-description/edit/' + this.jobDetail.ProfileDetail.ProfileId], { queryParams: { saveCopy: true } })
      } else {
        this.router.navigate(['jd/job-description/edit/' + this.jobDetail.ProfileDetail.ProfileId], { queryParams: { saveCopy: false } })
      }
    } else {
      this.router.navigate(['jd/job-description/edit/' + this.jobDetail.ProfileDetail.ProfileId])
    }
  }
  onCancel() {
    if (this.isSameUser) {
      this.router.navigate(['myJd/job-description/view/' + this.jobDetail.ProfileDetail.ProfileId]);
    }
    else {
      this.router.navigate(['allJd/job-description/view/' + this.jobDetail.ProfileDetail.ProfileId]);
    }
  }

  toggleShare() {
    var inputBox = this.document.getElementById('email');
    var shareButton = this.document.getElementById('shareButton');
    if (inputBox.style.display === "none") {
      inputBox.style.display = "block";
      shareButton.style.display = "none";
    } else {
      inputBox.style.display = "none";
      shareButton.style.display = "block";
    }
  }

  onShare() {
    this.toggleShare();
    this.IsReviewMode = 1;
    if (this.IsReviewMode === 1) {
      let navigationExtras: NavigationExtras = {
        queryParams: { reviewMode: 1 }
      };
      this.router.navigate(['jd/job-description/edit/' + this.jobDetail.ProfileDetail.ProfileId], navigationExtras);
    }
  }
  searchEmailOnKeypress(name) {
    if (name != undefined) {
      this.jobService.fetchEmailsByName(name).subscribe(res => {
        this.filteredEmails = res;

      })
    }
  }
  onSend(emailId) {
    this.toggleShare();
    this.url = this.document.URL;
    this.jobService.shareJdByEmail(emailId, this.url).subscribe(res => {
      this.router.navigate(['jd/job-description/edit/' + this.jobDetail.ProfileDetail.ProfileId])
    })
  }

  removeSpace(str) {
    return str.trim().replace(/[\s]+/g, ' ')
  }
  initLoad() {
  
    this.selectedLocationName = [];
    this.jobService.fetchProfiles(location.pathname.split('/').pop()).subscribe((jobDetail: any) => {
      if(jobDetail.StatusCode === 400){
        this.isDeletedJD =  true;
        this.router.navigate(['**']);
      }
      if (jobDetail.StatusCode === 200) {
        if (this.adalService.userInfo.profile.oid === jobDetail.ProfileDetail.CreatedBy) {
          this.isSameUser = true
        }
        this.mandatoryTagsList = jobDetail.ProfileDetail.TagsList.filter((x)=>x.TagType === 1);
        this.selectmandatorytags = this.mandatoryTagsList.map((x)=> x.TagName);
        this.desiredTagsList = jobDetail.ProfileDetail.TagsList.filter((x) => x.TagType === 2);
        this.selectdesiredtags = this.desiredTagsList.map((x)=>x.TagName);
        this.isDataFetched = true;
        const defaultMandatorySkill = [];
        const defaultDesiredSkill = [];
        const defaultQualification = [];
        const defaultResponsibility = [];
        this.jobDetail = jobDetail
        jobDetail.ProfileDetail.SkillList.forEach((ele) => {
          if (ele.SkillTypeId === 1) {
            defaultMandatorySkill.push(this.createMandatorySkill(ele));
          } else {
            defaultDesiredSkill.push(this.createDesiredSkill(ele));
          }
        }
        );
        jobDetail.ProfileDetail.QualificationList.forEach((ele) => {
          ele.isEditing = false
          defaultQualification.push(this.createQualification(ele));
        });
        jobDetail.ProfileDetail.ResponsibilityList.forEach((ele) => {
          ele.isEditing = false
          ele.Responsibility = [this.removeSpace(ele.Responsibility), [Validators.required,,this.noWhitespaceValidator]]
          defaultResponsibility.push(this.formBuilder.group(ele));
        }); 
        this.isPrivateChecked = jobDetail.ProfileDetail.IsPrivate;
        this.jobDescriptionForm = this.formBuilder.group({
          title: new FormControl(jobDetail.ProfileDetail.ProfileName),
          about: new FormControl(jobDetail.ProfileDetail.About, [Validators.required,this.noWhitespaceValidator]),
          selectedDesignation: new FormControl(jobDetail.ProfileDetail.DesignationId, Validators.required),
          selectedDesignationN: new FormControl(jobDetail.ProfileDetail.DesignationName, [Validators.required,Validators.pattern("(?!^ +$)^.+$")]),
          selectedLocation: new FormControl(jobDetail.ProfileDetail.LocationId, Validators.required),
          selectedExperience: new FormControl(jobDetail.ProfileDetail.ExperienceId, Validators.required),
          desiredSkills: this.formBuilder.array(defaultDesiredSkill),
          mandatorySkills: this.formBuilder.array(defaultMandatorySkill),
          qualifications: this.formBuilder.array(defaultQualification),
          rolesAndResponsibility: this.formBuilder.array(defaultResponsibility),
          mandatoryTags: new FormControl(''),
          desiredTags: new FormControl('')
        });
        this.jobService.FetchExperienceList().subscribe((experiences: any) => {
          if (experiences.StatusCode === 200) {
            this.experiences = experiences.ExperienceMasterList;
            experiences.ExperienceMasterList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedExperience').value === val.Id) {
                this.selectedExperienceName = val.ExperienceName;
              }
            });
          }
        });
          const tags = this.mandatoryTagsList.concat(this.desiredTagsList);
          this.tagName = tags.map((res)=>res.TagName);
          if(tags.length > 0){
            this.smartService.fetchCandidatesDetails(this.tagName).subscribe(
              response => {
                this.matchingConsultants = response;
                let consultants = this.matchingConsultants["MatchingConsultants"];
                this.filterCandidatesByMatchScore(consultants);
              })
          }
        this.jobService.FetchLocationList().subscribe((locations: any) => {
          if (locations.StatusCode === 200) {
            this.locations = locations.LocationMasterList;
            locations.LocationMasterList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedLocation').value.includes(val.Id)) {
                this.selectedLocationName.push(val.LocationName)
              }
            });
          }
        });

        this.jobService.FetchDesignationList().subscribe((designations: any) => {
          if (designations.StatusCode === 200) {
            this.designations = designations.DesignationList;
            this.filteredDesignations = designations.DesignationList;
            designations.DesignationList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedDesignation').value === val.Id) {
                this.selectedDesignationName = val.DesignationName;
                this.jobDescriptionForm.patchValue({ selectedDesignationN: val.DesignationName })
                this.FetchProfileSummary({ value: val.Id, viewValue: val.DesignationName })
              }
            });
          }
        });

      } else {
        this.jobDescriptionForm = this.formBuilder.group({
          title: new FormControl('Title of the job'),
          about: new FormControl('Summary of the job'),
          desiredSkill: this.formBuilder.array([this.formBuilder.group(
            { SkillId: 0, SkillName: 'default D skill', SkillTypeId: 2, SkillTypeName: 'Desired' }
          )
          ]),
          mandatorySkills: this.formBuilder.array([this.formBuilder.group(
            { SkillId: 0, SkillName: 'default M skill', SkillTypeId: 1, SkillTypeName: 'Mandatory' }
          )
          ]),
          qualifications: this.formBuilder.array([this.formBuilder.group({ Id: 0, Name: 'default qualification' })]),
        });
      }
      if(this.isEditJd){
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
      SkillName: [desiredSkill.SkillName, [Validators.required,,this.noWhitespaceValidator]],
      SkillTypeId: 2,
      SkillTypeName: 'Desired'
    });
  }
  addMandatorySkill(index,skills?): void {
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
    if(this.qualifications.length == 0)
    this.addQualification();
  }
  deleteResponsiblity(deletedResponsibility, index: number) {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    if (deletedResponsibility.Id.value !== 0) {
      this.deletedResponsiblities.push(deletedResponsibility.Id.value);
    }
    this.rolesAndResponsibility.removeAt(index);
    if(this.rolesAndResponsibility.length == 0)
    this.addResponsibility();
  }
  moveToDesired(selectedSkill, index) {
    const updatedSkill = {
      SkillId: (`MID${selectedSkill.SkillId.value}`),
      SkillName: selectedSkill.SkillName.value
    };
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.push(this.createDesiredSkill(updatedSkill));
    if(this.desiredSkills.value[0].SkillName == '')
    this.desiredSkills.removeAt(0);
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
    this.mandatorySkills.push(this.createMandatorySkill(updatedSkill));
    if(this.mandatorySkills.value[0].SkillName == '')
    this.mandatorySkills.removeAt(0);
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.removeAt(index);
    if(this.desiredSkills.length == 0){
      this.desiredSkills.push(this.createDesiredSkill({isEditing: true,
        SkillId: 0, SkillName: '', SkillTypeId: 2, SkillTypeName: 'Desired'}))
    }
  }

  viewCandidates(myModal?: any) {
    const tags = this.mandatoryTagsList.concat(this.desiredTagsList);
    this.tagName = tags.map((res)=>res.TagName);
    if(tags.length > 0){
      this.smartService.fetchCandidatesDetails(this.tagName).subscribe(
        response => {
          this.matchingConsultants = response;
          this.candidateRecordsAsPerSection = this.matchingConsultants["MatchingConsultants"]
          this.filterCandidatesByMatchScore(this.matchingConsultants["MatchingConsultants"],true);
        },error =>{
          this.matchingConsultants['Count'] = 0;
          this.candidateRecordsAsPerSection = null;
          this.matchingConsultants["MatchingConsultants"] = [];
          this.filterCandidatesByMatchScore(this.matchingConsultants["MatchingConsultants"],false);
        })
    }
  }

  viewiCIMSCandidates(myModal: any) {
    // this.iCIMSCandidates = [];
    this.iCIMSCandidates = null;
    const tags = this.mandatoryTagsList.concat(this.desiredTagsList);
    this.tagName = tags.map((res)=>res.TagName);
    if(tags.length > 0){
      this.smartService.fetchiCIMSCandidatesDetails(this.tagName).subscribe(
        response => {
           this.iCIMSCandidates  = response;
        }, error => {
          this.iCIMSCandidates = {
            "TotalCount": "1000+",
            "PartialMatch": {"Total":200,"CandidateList":[{"FirstName":"RITESH","Addresses":[{"AddressCity":"College Park","Entry":85842,"AddressZip":"20740","AddressState":{"Id":"D41001023","Abbrev":"MD","Value":"Maryland"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"8125 48th Avenue #201","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83004","Formattedvalue":"Mobile","Value":"Mobile"},"Entry":94233,"PhoneNumber":"2403305349","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/93114"}],"Email":"saroderit@gmail.com","LastName":"SARODE"},{"FirstName":"Bhargav Krishna","Addresses":[{"AddressCity":"Springfield","Entry":86374,"AddressZip":"62704","AddressState":{"Id":"D41001016","Abbrev":"IL","Value":"Illinois"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"13 Candlewood Dr","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83004","Formattedvalue":"Mobile","Value":"Mobile"},"Entry":94784,"PhoneNumber":"(217) 220-9827","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/93666"}],"Email":"bhargavkrishna557@gmail.com","LastName":"Thota"},{"FirstName":"Shruti","Addresses":[{"AddressCity":"Boston","Entry":86712,"AddressZip":"02120","AddressState":{"Id":"D41001024","Abbrev":"MA","Value":"Massachusetts"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"75 Saint Alphonsus Street","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83004","Formattedvalue":"Mobile","Value":"Mobile"},"Entry":95154,"PhoneNumber":"8573109173","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/94033"}],"Email":"shruti3mandke@gmail.com","LastName":"Mandke"},{"FirstName":"Shraddha","Addresses":[{"AddressCity":"Dallas","Entry":86758,"AddressZip":"75252","AddressState":{"Id":"D41001046","Abbrev":"TX","Value":"Texas"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"7825 MCCallum Blvd Apt 710","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83004","Formattedvalue":"Mobile","Value":"Mobile"},"Entry":95203,"PhoneNumber":"4695315267","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/94082"}],"Email":"shraddhagiraddi@gmail.com","LastName":"Giraddi"},{"FirstName":"Md Mehadi Hasan","Addresses":[{"AddressCity":"alexandria","Entry":87834,"AddressZip":"22311","AddressState":{"Id":"D41001049","Abbrev":"VA","Value":"Virginia"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"5055 seminary rd","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83002","Formattedvalue":"Home","Value":"Home"},"Entry":96317,"PhoneNumber":"5714899181","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/95192"}],"Email":"info@mdmehadihasan.com","LastName":"Mozumder"},{"FirstName":"Khwaja Moinuddin S","Addresses":[{"AddressCity":"Bridgeport","Entry":87927,"AddressZip":"06604","AddressState":{"Id":"D41001010","Abbrev":"CT","Value":"Connecticut"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"266 Broad Street","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83002","Formattedvalue":"Home","Value":"Home"},"Entry":96412,"PhoneNumber":"2037069429","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/95285"}],"Email":"khwajabiz@gmail.com","LastName":"Muhammad"},{"FirstName":"SREE LAKSHMI","Addresses":[{"AddressCity":"charlotte","Entry":88432,"AddressZip":"28262","AddressState":{"Id":"D41001036","Abbrev":"NC","Value":"North Carolina"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"9548K university terrace dr","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83002","Formattedvalue":"Home","Value":"Home"},"Entry":96932,"PhoneNumber":"7043457108","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/95826"}],"Email":"sreelakshmisetturu@gmail.com","LastName":"SETTURU"},{"FirstName":"AKSHAT","Addresses":[{"AddressCity":"Fremont","Entry":88620,"AddressZip":"94538","AddressState":{"Id":"D41001008","Abbrev":"CA","Value":"California"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"39951 Fremont Blvd, Apt 117","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83002","Formattedvalue":"Home","Value":"Home"},"Entry":97125,"PhoneNumber":"9088423844","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/96021"}],"Email":"shah.axat94@gmail.com","LastName":"SHAH"},{"FirstName":"Achuth","Addresses":[{"AddressCity":"Boston","Entry":88675,"AddressZip":"02125","AddressState":{"Id":"D41001024","Abbrev":"MA","Value":"Massachusetts"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"7 Peninsula Place Apt 201","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83004","Formattedvalue":"Mobile","Value":"Mobile"},"Entry":97186,"PhoneNumber":"8572718698","Primary":true}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/96077"}],"Email":"achuth.138208@gmail.com","LastName":"Kamath"},{"FirstName":"Dexter","Addresses":[{"AddressCity":"Winston Salem","Entry":88678,"AddressZip":"27103","AddressState":{"Id":"D41001036","Abbrev":"NC","Value":"North Carolina"},"AddressCountry":{"Id":"D41001","Abbrev":"US","Value":"United States"},"AddressType":{"Id":"D84002","Formattedvalue":"Home","Value":"Home"},"AddressStreet1":"1396 Old Mill Cir Suite 205","Primary":true}],"Folder":{"Id":"D32007","Formattedvalue":"Cand:Active","Value":"Cand:Active"},"Phones":[{"phonetype":{"Id":"D83002","Formattedvalue":"Home","Value":"Home"},"Entry":97190,"PhoneNumber":"336.714.2772","Primary":true},{"phonetype":{"Id":"D83001","Formattedvalue":"Work","Value":"Work"},"Entry":97192,"PhoneNumber":"336.714.2772","Primary":false},{"phonetype":null,"Entry":97191,"PhoneNumber":"336.714.2772","Primary":false},{"phonetype":{"Id":"D83004","Formattedvalue":"Mobile","Value":"Mobile"},"Entry":97189,"PhoneNumber":"336.251.9413","Primary":false}],"Links":[{"Rel":"self","Title":"The current profile being viewed.","Url":"https://api.icims.com/customers/6155/people/96080"}],"Email":"dexter@dll-consulting.com","LastName":"Lyons"}]},
            "ExactMatch": {
              "Total": 400,
              "CandidateList": [
                
              ]
            }

            
          };
        })
    }
  }
  
  onPaginateChange(evn) {
    const paramObject = {
      test: 1
    };
    this.pageSelected = evn.pageIndex !== undefined ? evn.pageIndex : evn,
      this.DefaultPageSize = evn.pageSize ? evn.pageSize : this.DefaultPageSize;
    this.fetchProfile(paramObject);
  }
  fetchProfile(paramObject) {
    for(var i =0; i<100;i++) {
    //  this.test.push(1);
 }
    // this.jobService.FetchFilteredProfiles(paramObject).subscribe((FilteredList: any) => {
    
    // });
  }

  onScroll() {
    // let pageDetails = { pageIndex: this.pageSelected + 1 };
    // this.onPaginateChange(pageDetails);
  }

  filterCandidatesByMatchScore(matchingConsultants: any[],isViewButton?) {
     
    this.candidateCountList[0].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage > 90);
    this.candidateCountList[1].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage > 80 && x.RelevancePercentage <= 90);
    this.candidateCountList[2].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage >= 70 && x.RelevancePercentage <= 80);
    this.candidateCountList[3].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage < 70);
    this.candidateCountList[0].count = this.candidateCountList[0].candidateDetail.length;
    this.candidateCountList[1].count = this.candidateCountList[1].candidateDetail.length;
    this.candidateCountList[2].count = this.candidateCountList[2].candidateDetail.length;
    this.candidateCountList[3].count = this.candidateCountList[3].candidateDetail.length;
    isViewButton ? this.pieChartData = this.candidateCountList.map(x => x.count) :  this.pieChartData = [];

  }
  addMandatoryTag(event: MatChipInputEvent, isAdd, i): void {
    if (isAdd) {
        const input = event.input;
        const value = event.value;
        let index = this.mandatoryTagsList.findIndex((i)=>{
          return (i.TagName == value);
        })
        // Add our tag
        if ((value || '').trim()) {
          if(index === -1 || value !== this.mandatoryTagsList[index].TagName)
          this.mandatoryTagsList.push({ Id: '', TagName: value.trim()});  
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
    this.populateDesiredSkills([this.desiredTagsList[this.desiredTagsList.length-1]]);
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
    this.desiredTagsList.map(x => x.TagType = 2);
      this.tagInputDesired.nativeElement.value = '';
      this.allTagsDesired.filter((option, index) => {
        if (option.Id.toLowerCase().includes(event.option.value.Id)) {
          this.allTagsDesired.splice(index,1);
        }
      });
      this.desiredTags.setValue(null);
    this.fetchAssociatedDesiredTags(this.desiredTagsList[this.desiredTagsList.length-1].TagName);
    this.populateDesiredSkills([event.option.value]);

  }

  selectedMandatoryTag(event: MatAutocompleteSelectedEvent,TagType){
    this.mandatoryTagsList.push(event.option.value);
    this.mandatoryTagsList.map(x => x.TagType =1);
    this.tagInputMandatory.nativeElement.value = '';
    this.allTags.filter((option, index) => {
      if (option.Id.toLowerCase().includes(event.option.value.Id)) {
        this.allTags.splice(index,1);
      }
    }); 
    this.mandatoryTags.setValue(null);
    this.populateMandatorySkills([event.option.value]);
    this.fetchAssociatedTags(this.mandatoryTagsList[this.mandatoryTagsList.length-1].TagName);
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

  populateMandatorySkills(tag){
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkillData = [];
    let skills = []
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
      })
    })
  }

  getMandatorySkill(event) {
    if (event.target.value.length > 2) {
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
    this.desigOption = 3;
    this.selectedDesignationName = designationEvent.viewValue;
    this.jobDescriptionForm.patchValue({ selectedDesignationN: designationEvent.viewValue })
    this.jobDescriptionForm.patchValue({ selectedDesignation: designationEvent.value })
    let designationObject = { designationId: designationEvent.value, name: designationEvent.viewValue }
    this.jobService.FetchProfileSummary(designationObject).subscribe((Data: any) => {
      if (Data.StatusCode) {
        this.suggestedSummary = Data.ProfileSummary;
      }
    })
  }
  removeDesignation(event){
    this.desigOption = event.length;
  }
  selectSuggestion(selectedSuggestion) {
    this.jobDescriptionForm.patchValue({ about: selectedSuggestion })
  }
  isSkillNameNotEmpty(controls) {
    return controls.SkillName.value.trim() !="" ; 
  }
  isQualificationEmpty(controls){
    return controls.Name.value.trim() !="";
  }
  isResponsibilityEmpty(controls){
  return controls.Responsibility.value.trim() !="";
  }
  checkDuplicateDesignation(event) {
    if (!isNaN(this.jobDescriptionForm.get('selectedDesignation').value)) {
      this.isDuplicateDesignation = false
    }
    if (isNaN(this.jobDescriptionForm.get('selectedDesignation').value)) {

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
  clearDesignationId(evnt) {
    if ((evnt.keyCode >= 48 && evnt.keyCode <= 57) || (evnt.keyCode >= 65 && evnt.keyCode <= 90)) {
      this.jobDescriptionForm.patchValue({ selectedDesignation: evnt.target.value })
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

  deleteProfile() {
    this.jobService.deleteProfile(location.href.split('/')[location.href.split('/').length - 1]).subscribe((data: any) => {
      if (data.StatusCode === 200) {
        this.toastr.success(data.Message, 'Success');
        this.router.navigate(['myJd']);
      }
    })
  }
  makePrivate() {
    this.jobService.PrivatizeProfile(location.href.split('/')[location.href.split('/').length - 1]).subscribe((data: any) => {
      if (data.StatusCode === 200) {
        this.router.navigate(['myJd']);
      }
    })
  }

  onSave() {
   
    this.submitted = true;
    
    if (this.jobDescriptionForm.invalid || this.mandatoryTagsList.length < 1 || this.desiredTagsList.length < 1|| this.isDuplicateDesignation ) {
      return;
    }
    const jdObject = {
      ProfileId: location.pathname.split('/').pop(),
      ProfileName: this.jobDescriptionForm.get('title').value,
      About: this.jobDescriptionForm.get('about').value,
      DesignationId: this.jobDescriptionForm.get('selectedDesignation').value,
      LocationId: this.jobDescriptionForm.get('selectedLocation').value,
      ExperienceId: this.jobDescriptionForm.get('selectedExperience').value,
      SkillList: [...this.jobDescriptionForm.get('mandatorySkills').value, ...this.jobDescriptionForm.get('desiredSkills').value],
      QualificationList: this.jobDescriptionForm.get('qualifications').value,
      ResponsibilityList: this.jobDescriptionForm.get('rolesAndResponsibility').value,
      TagsList: (this.mandatoryTagsList.concat(this.desiredTagsList)),
      DeletedQualifications: this.deletedQualifications,
      DeletedSkills: this.deletedSkills,
      DeletedResponsibilities: this.deletedResponsiblities,
      DeletedTags: (this.deletedMandatoryTags.concat(this.deletedDesiredTags)),
      NewDesignation: isNaN(this.jobDescriptionForm.get('selectedDesignation').value) ? this.jobDescriptionForm.get('selectedDesignation').value : undefined,
      isPrivate: this.isPrivateChecked,
      copyJd: (this.saveAsCopy ? true : false)
    };
    this.jobService.saveJd(jdObject).subscribe((updatedData: any) => {
      if (updatedData.StatusCode === 200) {

        this.toastr.success(updatedData.Message, 'Success');

        if (this.isSameUser) {
          this.jobDetail.ProfileDetail.UpdatedDate = updatedData.ProfileDetail.UpdatedDate
          this.isEditJd = false
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          this.initLoad()
          this.router.navigate(['myJd/job-description/view/', this.jobDetail.ProfileDetail.ProfileId]);
        } else if (this.IsSharedJD) {
          this.router.navigate(['/jdsShared']);
        }
        else {
          this.router.navigate(['allJd/job-description/view/', this.jobDetail.ProfileDetail.ProfileId]);
        }
      } else {
        this.toastr.error(updatedData.Message, 'Error');
      }
    });
  }
  }