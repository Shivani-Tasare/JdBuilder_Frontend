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
  url: string;
  filteredEmails: any;
  isIconChecked: boolean = false;
  tagName: string[]=[];
  mandatorySkillData = [];
  desiredSkillData = [];
  constructor(private loaderService: LoaderService, private changeDetectorRefs: ChangeDetectorRef,public dialog: MatDialog, @Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private jobService: Job1ServiceService, private toastr: ToastrService, private router: Router, private commonJobService: JobServiceService, private adalService: AdalService, private route: ActivatedRoute, private smartService: SmartServiceService) {
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
      }
    });
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
  viewCandidates(){
    
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
  }