'use client';

import React from 'react';
import {
  personalInfo,
  summary,
  skills,
  coreCompetencies,
  projects,
  experience,
  education,
  certifications,
} from '@/data/resume';

export default function BoringResume() {
  return (
    <div className="boring-wrapper" id="boring-wrapper">
      <div className="resume-page" id="resume-page">
        {/* Header */}
        <div className="resume-header">
          <h1>{personalInfo.name}</h1>
          <div className="resume-contact">
            <span>{personalInfo.phone}</span>
            <span>{personalInfo.email}</span>
            <span>{personalInfo.linkedin}</span>
            <span>{personalInfo.github}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="resume-section">
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>

        {/* Skills */}
        <div className="resume-section">
          <h2>Skills</h2>
          <div className="skills-grid">
            <span className="label">Languages</span>
            <span className="value">{skills.languages.join(', ')}</span>
            <span className="label">AI / ML</span>
            <span className="value">{skills.ai.join(', ')}</span>
            <span className="label">Computer Vision</span>
            <span className="value">{skills.cv.join(', ')}</span>
            <span className="label">Web & Backend</span>
            <span className="value">{skills.web.join(', ')}</span>
            <span className="label">Security</span>
            <span className="value">{skills.security.join(', ')}</span>
            <span className="label">Data</span>
            <span className="value">{skills.data.join(', ')}</span>
          </div>
        </div>

        {/* Core Competencies */}
        <div className="resume-section">
          <h2>Core Competencies</h2>
          <ul className="competencies-list">
            {coreCompetencies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        <div className="resume-section">
          <h2>Projects</h2>
          {projects.map((p) => (
            <div className="project-item" key={p.name}>
              <h3>{p.name}: {p.subtitle}</h3>
              <div className="stack">{p.stack.join(', ')}</div>
              <ul>
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className="resume-section">
          <h2>Experience</h2>
          <div className="experience-header">
            <h3>{experience.title}</h3>
            <span className="period">{experience.period}</span>
          </div>
          <div className="experience-company">{experience.company}</div>
          <ul>
            {experience.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>

        {/* Education */}
        <div className="resume-section">
          <h2>Education</h2>
          {education.map((ed) => (
            <div className="education-item" key={ed.institution}>
              <div className="left">
                <h3>{ed.institution}</h3>
                <p>{ed.degree}</p>
              </div>
              <div className="right">
                <div>{ed.period}</div>
                <div>{ed.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="resume-section">
          <h2>Certifications</h2>
          <ul className="cert-list">
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
