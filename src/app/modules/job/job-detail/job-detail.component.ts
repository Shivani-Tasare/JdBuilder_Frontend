import { Component, OnInit, Directive, ChangeDetectorRef, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import * as JSPdf from 'jspdf';
import html2canvas from 'html2canvas';
import { LoaderService } from 'src/app/shared/services/loader.service';
import htmlToPdfmake from 'html-to-pdfmake'
import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { SmartServiceService } from 'src/app/services/smart-service.service';
import { JdDetails } from 'src/app/shared/models/jd-details';
import { MatchingConsultants } from 'src/app/shared/models/matchingConsultants';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
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
  suggestedSkill = [];
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
  constructor(private loaderService: LoaderService, public dialog: MatDialog, @Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private jobService: Job1ServiceService, private toastr: ToastrService, private router: Router, private commonJobService: JobServiceService, private adalService: AdalService, private route: ActivatedRoute, private smartService: SmartServiceService) {
  }
  public downloadPDF() {
    let loader = this.loaderService
    loader.show();
    let quotes = document.getElementById('content-pdf');
    html2canvas(document.getElementById('content-pdf'), { scrollY: -window.scrollY }).then(function (canvas) {

      var img = canvas.toDataURL("image/png");

      var doc = new JSPdf('p', 'pt', 'letter');
      for (var i = 0; i <= quotes.clientHeight / 1450; i++) {
        var srcImg = canvas;
        var sX = 0;
        var sY = 1450 * i;
        var sWidth = 1100;
        var sHeight = 1450;
        var dX = 0;
        var dY = 0;
        var dWidth = 1100;
        var dHeight = 1450;

        let onePageCanvas = document.createElement("canvas");
        onePageCanvas.setAttribute('width', "1100");
        onePageCanvas.setAttribute('height', "1450");
        var ctx = onePageCanvas.getContext('2d');
        ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
        var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

        var width = onePageCanvas.width;
        var height = onePageCanvas.clientHeight;

        if (i > 0) {
          doc.addPage(612, 791);
        }

        doc.setPage(i + 1);
        doc.addImage(canvasDataURL, 'PNG', 25, 20, (width * 0.5), (height * 0.5));

      }

      doc.save('testCanvas.pdf');
      loader.hide();
    });
  }
  public downloadPDF2() {
    let htmlContent = this.document.getElementById('content-pdf')
    this.jobService.GeneratePDF({ htmlContent: htmlContent.outerHTML }).subscribe((data: any) => {
      let blob = new Blob([data.body], {
        type: 'application/pdf'
      });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'samplePDFFile.pdf';
      link.click();
      window.URL.revokeObjectURL(link.href);
    })
  }
  public downloadPDF3() {
    let loader = this.loaderService

    var html = htmlToPdfmake(this.document.getElementById('content-pdf').outerHTML);

    var docDefinition = {
      content: [
        html
      ],
      styles: {
        'html-strong': {
          background: 'yellow'
        }
      }
    };
    var pdfDocGenerator = pdfMake.createPdf(docDefinition).download();
  }
  // openCandidateProfile(link) {
  //   window.location.href = "";

  // }
  onChartClick(event) {
    if(!!event.active.length) {

    const candidateRecords = this.candidateCountList.filter( (r) => {
      return r.label == event.active[0]._model.label;
    });
    this.candidateRecordsAsPerSection = (candidateRecords.length > 0) 
      ? candidateRecords[0].candidateDetail : [];
    }

    }
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
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


  initLoad() {
  
    this.selectedLocationName = [];
    this.jobService.fetchProfiles(location.pathname.split('/').pop()).subscribe((jobDetail: any) => {
      if (jobDetail.StatusCode === 200) {
        if (this.adalService.userInfo.profile.oid === jobDetail.ProfileDetail.CreatedBy) {
          this.isSameUser = true
        }
        this.mandatoryTagsList = jobDetail.ProfileDetail.TagsList.filter((x)=>x.TagType === 1);
        this.desiredTagsList = jobDetail.ProfileDetail.TagsList.filter((x) => x.TagType === 2);
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
          ele.Responsibility = [ele.Responsibility, Validators.required]
          defaultResponsibility.push(this.formBuilder.group(ele));
        }); 
        this.isPrivateChecked = jobDetail.ProfileDetail.IsPrivate;
        this.jobDescriptionForm = this.formBuilder.group({
          title: new FormControl(jobDetail.ProfileDetail.ProfileName),
          about: new FormControl(jobDetail.ProfileDetail.About, Validators.required),
          selectedDesignation: new FormControl(jobDetail.ProfileDetail.DesignationId, Validators.required),
          selectedDesignationN: new FormControl(jobDetail.ProfileDetail.DesignationName, Validators.required),
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
    });
  }
  compareWithFunc = (a: any, b: any) => a == b;
  createMandatorySkill(newSkill): FormGroup {
    return this.formBuilder.group({
      isEditing: newSkill.isEditing ? newSkill.isEditing : false,
      SkillId: newSkill.SkillId,
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
      SkillId: desiredSkill.SkillId,
      SkillName: [desiredSkill.SkillName, Validators.required],
      SkillTypeId: 2,
      SkillTypeName: 'Desired'
    });
  }
  addMandatorySkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    const newSkill = {
      isEditing: true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName: 'Mandatory'
    };
    this.mandatorySkills.push(this.createMandatorySkill(newSkill));
  }
  addDesiredSkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    const newSkill = {
      isEditing: true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName: 'Desired'
    };
    this.mandatorySkills.push(this.createDesiredSkill(newSkill));
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

  viewCandidates(myModal: any) {
    const tags = this.mandatoryTagsList.concat(this.desiredTagsList);
    this.tagName = tags.map((res)=>res.TagName);
    if(tags.length > 0){
      this.smartService.fetchCandidatesDetails(this.tagName).subscribe(
        response => {
          this.matchingConsultants = response;
          this.filterCandidatesByMatchScore(this.matchingConsultants["MatchingConsultants"]);
        })
    }
  }

  filterCandidatesByMatchScore(matchingConsultants: any[]) {
     
    this.candidateCountList[0].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage > 90);
    this.candidateCountList[1].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage > 80 && x.RelevancePercentage <= 90);
    this.candidateCountList[2].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage >= 70 && x.RelevancePercentage <= 80);
    this.candidateCountList[3].candidateDetail = matchingConsultants.filter((x) => x.RelevancePercentage < 70);
    this.candidateCountList[0].count = this.candidateCountList[0].candidateDetail.length;
    this.candidateCountList[1].count = this.candidateCountList[1].candidateDetail.length;
    this.candidateCountList[2].count = this.candidateCountList[2].candidateDetail.length;
    this.candidateCountList[3].count = this.candidateCountList[3].candidateDetail.length;
    this.pieChartData = this.candidateCountList.map(x => x.count);

  }
  addMandatoryTag(event: MatChipInputEvent, isAdd, TagType): void {
    if (isAdd) {
        const input = event.input;
        const value = event.value;
        // Add our tag
        if ((value || '').trim()) {
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
  }
  appendToDesiredTags(index) {
    this.desiredTagsList.push({Id: this.associatedDesiredTags[index].Id, TagName: this.associatedDesiredTags[index].TagName, TagType:2});
    this.allTagsDesired  = this.allTagsDesired.filter((r)=>{
      return r.TagName  != this.associatedDesiredTags[index].TagName;
    });
    this.associatedDesiredTags.splice(index, 1);
    this.fetchAssociatedDesiredTags(this.desiredTagsList[this.desiredTagsList.length-1].TagName);
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
      this.allTags.push(tag);
      this.deletedMandatoryTags.push({Id:tag.Id,TagType:tag.TagType});
    }
  }
  (!!this.mandatoryTagsList[this.mandatoryTagsList.length-1]) ? 
  this.fetchAssociatedTags(this.mandatoryTagsList[this.mandatoryTagsList.length-1].TagName)
  : null;
}
  fetchAssociatedTags(value) {
    this.associatedTags = [];
    this.jobService.FetchAssociatedTags(value).subscribe((skillData: any) => {
      skillData = skillData.splice(0,3)
      skillData.forEach((v,i)=> {
        this.associatedTags.push({Id: `ID${i}`, TagName: v});
      });
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
    this.desiredTagsList.map(x => x.TagType = 2);
      this.tagInputDesired.nativeElement.value = '';
      this.allTagsDesired.filter((option, index) => {
        if (option.Id.toLowerCase().includes(event.option.value.Id)) {
          this.allTagsDesired.splice(index,1);
        }
      });
      this.desiredTags.setValue(null);
    this.fetchAssociatedDesiredTags(this.desiredTagsList[this.desiredTagsList.length-1].TagName);

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
    this.jobDescriptionForm.controls['rolesAndResponsibility'].value[index].Responsibility = event.option.value
  }
  getSkill(event) {
    if (event.target.value.length > 2) {

      if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)) {
        this.jobService.FetchAllSkills(event.target.value).subscribe((skillData: any) => {
          if (skillData.StatusCode) {
            this.suggestedSkill = skillData.Skills;
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
  selectSuggestion(selectedSuggestion) {
    this.jobDescriptionForm.patchValue({ about: selectedSuggestion })
  }
  clearSummary() {
    this.jobDescriptionForm.patchValue({ about: "" })
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
    //this.jobDescriptionForm.controls['this.mandatoryTags'].setValue(this.mandatoryTagsList);
    //this.jobDescriptionForm.controls['this.desiredTags'].setValue(this.desiredTagsList);
    if (this.jobDescriptionForm.invalid || this.mandatoryTagsList.length < 1 || this.desiredTagsList.length < 1|| this.isDuplicateDesignation) {
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